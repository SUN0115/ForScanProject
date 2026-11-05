# Vue 3 + Vuetify + NestJS + Docker PostgreSQL 簡易專案

這是一個包含前端、後端與容器化資料庫的完整簡易全端範例專案（任務管理系統 Task Manager）。

---

## 🛠️ 技術架構

- **前端 (Frontend)**
  - **Vue 3** (Composition API, `<script setup>`)
  - **Vuetify 3** (Material Design 3 元件庫、MDI 圖示)
  - **Vite** (極速構建與熱更新)
  - **Axios** (API 通訊，已設置 Vite Proxy 到後端)

- **後端 (Backend)**
  - **NestJS** (TypeScript)
  - **TypeORM** (物件關聯映射，自動同步 schema)
  - **RESTful API** (CRUD endpoints)

- **資料庫 (Database)**
  - **Docker** 容器化
  - **PostgreSQL** 映像檔：`postgres@sha256:266d3c257594e195b309ae9d1805e54c788f1d7b375f56bf6c367aac6c917e7b`
  - 預設 Port: `5432`，資料庫名稱：`nest_db`

---

## 📁 專案目錄結構

```text
Pra_vlun/
├── docker-compose.yml       # PostgreSQL 容器配置 (指定 sha256 映像檔)
├── package.json             # 根目錄管理腳本
├── backend/                 # NestJS 後端
│   ├── src/
│   │   ├── tasks/           # Tasks CRUD 模組 (Entity, DTO, Service, Controller)
│   │   ├── app.module.ts    # 資料庫連線配置 (TypeORM)
│   │   └── main.ts          # 伺服器入口 (Port 3000, 啟用 CORS)
│   └── package.json
└── frontend/                # Vue 3 + Vuetify 前端
    ├── src/
    │   ├── App.vue          # 任務管理介面 (Vuetify 元件、明暗主題切換)
    │   └── plugins/         # Vuetify 套件配置
    ├── vite.config.mts      # Vite 配置 (Port 5173, /api 代理)
    └── package.json
```

---

## 🚀 快速啟動步驟

### 1. 啟動 PostgreSQL 資料庫容器
在專案根目錄執行：
```bash
npm run db:up
```
或直接使用 Docker 命令：
```bash
docker compose up -d
```
> 資料庫將在背景啟動並監聽 `localhost:5432`。

---

### 2. 啟動 NestJS 後端
開啟終端機執行：
```bash
npm run backend:dev
```
- 後端服務位址：`http://localhost:3000/api`
- 首次啟動時，TypeORM 會自動在 PostgreSQL 中建立 `tasks` 資料表。

---

### 3. 啟動 Vue + Vuetify 前端
開啟另一個終端機執行：
```bash
npm run frontend:dev
```
- 前端網頁位址：`http://localhost:5173`
- 前端已設定代理（Proxy），所有 `/api` 請求會自動轉發至 `http://localhost:3000`。

---

## 🔌 API 端點說明

| 方法 | 路徑 | 說明 |
| :--- | :--- | :--- |
| `GET` | `/api/tasks` | 取得所有任務清單 |
| `GET` | `/api/tasks/:id` | 取得單一任務詳細資訊 |
| `POST` | `/api/tasks` | 新增任務（傳入 `{ title, description }`） |
| `PATCH` | `/api/tasks/:id` | 修改任務狀態或內容（支援修改 `title`, `description`, `isCompleted`） |
| `DELETE` | `/api/tasks/:id` | 刪除指定任務 |

---

## 🛑 停止資料庫容器
若要停止 PostgreSQL 容器：
```bash
npm run db:down
```

