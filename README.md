# Tauri v2 + Tauri Plugin SQL: SQLite Connection Examples in TypeScript & Rust

## What's this?
The official documentation explains how to connect to the database from TypeScript using a plugin, but there's no example for connecting from Rust! So, I wrote it in this repository.

- Migration: Tauri Plugin SQL
- Database Connection from TypeScript: Tauri Plugin SQL (This uses sqlx internally.)
- Database Connection from Rust: sqlx

## References
https://v2.tauri.app/plugin/sql/


## Memo

```
For Desktop development, run
  npm run tauri dev

For Android development, run:
  npm run tauri android dev

For iOS development, run:
  npm run tauri ios dev
```

## Impression

While tauri-plugin-sql is convenient for tasks like migrations during app initialization or connecting to the database from TypeScript, I felt that it's not strictly necessary if you're only connecting to the database from Rust.  
As introduced on the site below, it might be better to handle both migrations and connections independently using tools like sqlx (or Diesel).  
https://www.ey-office.com/blog_archive/2024/08/27/learned-rust-so-i-wrote-a-backend-for-tauri/
