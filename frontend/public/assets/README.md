# Assets Directory

Place your static assets (videos, images, audio, etc.) in this folder.

In your Next.js frontend, any file placed in the `public/assets` folder can be served at the path `/assets/filename`.

## How to use a video on the Landing Page (`frontend/src/app/page.tsx`)

Once you upload your video file (for example, `bg-video.mp4` or `hero-video.mp4`) into this folder, you can display it using a standard HTML5 `<video>` tag:

```tsx
<video 
  autoPlay 
  loop 
  muted 
  playsInline
  className="absolute inset-0 w-full h-full object-cover -z-10"
>
  <source src="/assets/hero-video.mp4" type="video/mp4" />
  Your browser does not support the video tag.
</video>
```

Replace `/assets/hero-video.mp4` with the actual path to your video.
