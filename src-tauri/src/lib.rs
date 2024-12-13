use sqlx::{Row, SqlitePool};
use tauri::Manager;
use tauri_plugin_sql::{Migration, MigrationKind};

struct User {
    name: String,
}
impl User {
    fn new(name: String) -> Self {
        Self { name }
    }
}

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

// The document version is v1, but it should still be helpful.
// By using AppHandle, you can obtain the path to the application's folder.
// https://v1.tauri.app/v1/guides/features/command/#accessing-an-apphandle-in-commands
#[tauri::command]
async fn get_db_value(app_handle: tauri::AppHandle) -> String {
    let app_data_dir_path = app_handle.path().app_data_dir().unwrap();
    let app_data_dir = app_data_dir_path.to_str().unwrap();

    //  I think there's a better way to resolve the path...
    let db_url = format!("{}/mydatabase.db", app_data_dir);

    let db: SqlitePool = SqlitePool::connect(&db_url).await.unwrap();
    let query_result = sqlx::query("SELECT name FROM users LIMIT 1")
        .fetch_all(&db)
        .await
        .unwrap();
    let user_list: Vec<User> = query_result
        .iter()
        .map(|row| User::new(row.get::<String, &str>("name")))
        .collect();
    let user = user_list.get(0).unwrap();

    format!("{}", user.name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let migration = vec![Migration {
        version: 1,
        description: "create_initial_tables",
        sql: "CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT); INSERT INTO users (name) VALUES ('Alice');",
        kind: MigrationKind::Up,
    }];

    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(
            tauri_plugin_sql::Builder::default()
                // If you want to access the actual sqlite file for debugging or other purposes, please refer to this.
                // https://github.com/tauri-apps/plugins-workspace/issues/198
                .add_migrations("sqlite:mydatabase.db", migration)
                .build(),
        )
        .invoke_handler(tauri::generate_handler![greet, get_db_value])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
