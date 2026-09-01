# Sachit's Portfolio

A 3D paper-themed interactive portfolio website showcasing full-stack web applications, AI-powered tools, systems architecture, and automation projects.

## 🌟 Overview

This portfolio is built with a bespoke 3D interactive web environment inspired by tactile paper and cinematic film strips. It features custom WebGL shaders, real-time procedural animations, and a clean, minimalist typography-driven design.

## 🚀 Tech Stack

- **Framework**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS
- **3D & Animation**: Three.js, WebGL (Custom GLSL Shaders), GSAP, Anime.js
- **Audio**: Web Audio API for interactive spatial soundscapes
- **Deployment**: Vercel / Google Cloud Run

## 📁 Project Structure

- `/src/components/Portfolio` - The main portfolio sections (Hero, About, Projects, Experience, Contact)
- `/src/components/UI` - Reusable UI components and animation wrappers (TextReveal, ScrollReveal)
- `/src/components/PaperIntro` - The 3D WebGL paper simulation and intro sequence
- `/src/utils` - Helper functions, shaders, and WebGL utilities

## 🛠️ Local Development

To run this project locally, follow these steps:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/sachit1751-art/portfo-final-sachit.git
   cd portfo-final-sachit
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:3000`.

4. **Build for production:**
   ```bash
   npm run build
   ```

## 🎨 Features

- **Custom WebGL Shaders**: Procedural paper grain, crumple physics, and lighting reflections.
- **Performance Optimized**: 60 FPS continuous animation pipeline with instanced mesh rendering.
- **Responsive Design**: Fluid typography and adaptive layouts that work flawlessly on mobile and desktop.
- **Interactive UI**: Custom text reveals, scroll animations, and interactive project modals.

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
