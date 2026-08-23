# Kim Khanh — Personal Archive

A warm, botanical personal website for collecting flowers, places, words, and small everyday joys. The experience combines editorial typography, paper-like surfaces, gentle scroll motion, and an interactive 3D flower study.

## Highlights

- Editorial hero with a custom floral letterform and staggered type reveal
- Three.js botanical model with a lightweight development-only tuning panel
- OGL pollen trail that follows the pointer
- Scroll-linked sunflower divider and growing botanical illustrations
- Pinned About-to-Archive transition
- Scrapbook-style personal archive with layered image parallax
- Smooth scrolling and reduced-motion support
- Responsive App Router implementation

## Stack

- Next.js 16 and React 19
- TypeScript
- Tailwind CSS 4
- GSAP and ScrollTrigger
- Three.js
- OGL
- Lenis

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

```bash
npm run dev        # Start the development server
npm run typecheck  # Check TypeScript
npm run lint       # Run ESLint
npm run build      # Create a production build
npm run start      # Serve the production build
```

## Project structure

```text
app/          App Router entry points and global styles
components/   Layout, sections, animation, and botanical components
data/         Navigation and archive content
hooks/        Shared React hooks
lib/          Animation setup
public/       Images and the 3D model
```

## Credits

Created by [trhgatu](https://github.com/trhgatu).

The 3D model “Rhododendron - Azalea (Free download)” is by [Nestaeric](https://sketchfab.com/Nestaeric), sourced from [Sketchfab](https://sketchfab.com/3d-models/rhododendron-azalea-free-download-d4cbd63bd7a64bc6af3fb06079468dff), and licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). See [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md) for details.

## License

The source code is available under the [MIT License](./LICENSE). Files in `public/` may contain original or third-party visual assets and are not automatically covered by the MIT License; their respective terms still apply.
