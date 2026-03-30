# AI Photo Restore 🖼️

> 一键修复老照片，让珍贵的回忆重现光彩

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/ai-photo-restore)

## ✨ 功能特性

- 🔧 **智能修复** - 自动修复划痕、折痕、污渍
- 🎨 **黑白上色** - AI 智能为老照片上色
- ⚡ **快速处理** - 先进的 AI 模型，即时处理
- 📱 **响应式设计** - 完美支持移动端

## 🚀 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/YOUR_USERNAME/ai-photo-restore.git
cd ai-photo-restore
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

创建 `.env.local` 文件：

```env
REPLICATE_API_TOKEN=your_token_here
```

从 [Replicate](https://replicate.com) 获取 API Token

### 4. 启动开发服务器

```bash
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000)

### 5. 构建生产版本

```bash
npm run build
```

## 🌐 部署到 Cloudflare Pages

### 方式一：GitHub Actions（推荐）

1. Fork 此项目
2. 在 Cloudflare Dashboard 创建 Pages 项目
3. 添加以下 Secrets：
   - `CLOUDFLARE_API_TOKEN`
   - `CLOUDFLARE_ACCOUNT_ID`
   - `REPLICATE_API_TOKEN`
4. Push 到 main 分支，自动部署

### 方式二：手动部署

```bash
# 安装 Wrangler
npm install -g wrangler

# 部署
npx wrangler pages deploy out
```

## 📁 项目结构

```
ai-photo-restore/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── restore/
│   │   │       └── route.ts    # AI 修复 API
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx            # 主页面
│   ├── components/
│   └── lib/
├── public/
├── .env.local.example
├── next.config.js
├── package.json
├── tailwind.config.js
└── tsconfig.json
```

## 🔧 技术栈

- **框架**: Next.js 14 (App Router)
- **样式**: Tailwind CSS
- **AI**: Replicate API (Bringing Old Photos Back to Life)
- **部署**: Cloudflare Pages

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License