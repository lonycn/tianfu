This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

  Project Overview

  This is a Vue 3 visualization dashboard for the "天福国家湿地公园" (Tianfu National Wetland Park) Smart Management Platform. It's a large-screen data visualization
  system focusing on IoT + AI agricultural monitoring and ecological protection.

  Tech Stack

  - Framework: Vue 3.5.17 with Composition API
  - Build Tool: Vite 5.4.10
  - Language: TypeScript 5.8.3
  - UI Library: Element Plus 2.10.2
  - Data Visualization:
    - ECharts 5.6.0
    - @kjgl77/datav-vue3 1.7.4 (specialized for large screens)
  - Map: @amap/amap-jsapi-loader 1.0.1 (AMap/Gaode Maps)
  - State Management: Pinia 3.0.3
  - Routing: Vue Router 4.5.1
  - Styling: SCSS with Sass 1.89.2

  Development Commands

  # Install dependencies
  npm install

  # Start development server (port 3000, auto-opens browser)
  npm run dev

  # Build for production
  npm run build

  # Preview production build
  npm run preview

  Project Architecture

  The project follows a modular component-based architecture:

  - src/components/ - Reusable UI components (Charts, Data displays, Layout, Map)
  - src/views/ - Page components (11 different monitoring pages)
  - src/stores/ - Pinia state management for real-time data
  - src/composables/ - Vue 3 composition functions
  - src/utils/ - Utility functions
  - src/data/ - Static data (map boundaries, icons)
  - src/router/ - Route definitions with lazy loading
  - src/types/ - TypeScript type definitions
  - src/styles/ - Global SCSS styles and variables

  Key Features & Pages

  1. HomePage - Main dashboard with AMap integration
  2. Dashboard - Secondary dashboard view
  3. AgriculturePage - Smart agriculture monitoring
  4. QualityPage - Green planting and quality supervision
  5. EcologyPage - Ecological environment monitoring
  6. BirdMonitoringPage - Bird species tracking (235 species)
  7. EducationPage - Education and research modules
  8. FactoryPage - Seedling factory automation
  9. MaintenancePage - System maintenance
  10. MapDrawPage - Map area drawing tool
  11. WaterQualityPage - Water quality monitoring

  Important Implementation Notes

  Large Screen Optimization

  - Designed for 3840x2160 resolution displays
  - Uses DataV components optimized for large screen visualization
  - Responsive scaling considerations implemented

  Real-time Data Architecture

  - Pinia store manages environmental data (temperature, humidity, pH, etc.)
  - Device status tracking and monitoring point management
  - Computed properties for aggregated statistics

  Map Integration

  - AMap (高德地图) is used for geographical visualization
  - Map boundaries and custom icons are stored in src/data/
  - WetlandMap component handles map rendering and interactions

  Current Implementation Status

  - ✅ Basic routing and page structure
  - ✅ Component architecture established
  - ✅ State management setup
  - ✅ Map integration with boundaries
  - ⏳ WebSocket for real-time data (TODO)
  - ⏳ API integration layer (TODO)
  - ⏳ Screen adaptation utilities (TODO)

  Development Guidelines

  Code Style

  - Use TypeScript strict mode
  - Follow Vue 3 Composition API patterns
  - Component names in PascalCase
  - SCSS for styling with variables

  Performance Considerations

  - Lazy load routes and heavy components
  - Optimize map rendering for large datasets
  - Consider data update frequency for real-time displays

  Missing Tooling

  Currently, there's no ESLint or testing setup. Consider adding:
  - ESLint + Prettier for code formatting
  - Vitest for unit testing
  - Pre-commit hooks for code quality