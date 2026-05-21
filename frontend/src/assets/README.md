# Src Assets Directory

Place your frontend source assets (images, icons, etc.) that you want to import directly into components here:

```tsx
import myImage from '@/assets/my-image.png';
```

For large files like videos, it is highly recommended to place them in the `public/assets/` directory instead, and reference them as:

```tsx
<video src="/assets/my-video.mp4" ... />
```
