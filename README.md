# Interactive Cosmos Sphere - Three.js Element

An immersive Three.js element featuring an interactive cosmos sphere with mouse controls, scroll animations, and particle effects.

## Features

- **360° Mouse Rotation**: Drag to rotate the cosmos sphere in any direction
- **Auto-Rotation**: Sphere automatically rotates when not being interacted with
- **Scroll-Based Zoom**: Scroll to zoom in/out and trigger additional animations
- **Dynamic Particle System**: 5000+ animated star particles create an immersive space environment
- **Custom Shader Effects**: Real-time shader animations for dynamic cosmos visualization
- **Responsive Design**: Adapts to all screen sizes
- **Smooth Animations**: 60fps performance with optimized rendering

## Files

- `cosmos-sphere.html` - Main HTML file with structure
- `cosmos-sphere.css` - Styling and animations
- `cosmos-sphere.js` - Three.js implementation with all interactive features

## How to Use

1. **Open the HTML file**: Simply open `cosmos-sphere.html` in a modern web browser
2. **Interact**:
   - Click and drag to rotate the sphere
   - Scroll to zoom and trigger animations
   - Move your mouse to create subtle parallax effects
3. **Customize**: Edit the JavaScript file to adjust colors, particle count, rotation speed, etc.

## Customization Options

### In `cosmos-sphere.js`:

```javascript
// Adjust sphere size
const geometry = new THREE.SphereGeometry(2, 64, 64); // radius, width segments, height segments

// Change particle count
const particlesCount = 5000; // Increase/decrease for more/fewer stars

// Modify rotation speed
controls.autoRotateSpeed = 0.5; // Higher = faster

// Adjust colors
color1: { value: new THREE.Color(0x667eea) } // Purple
color2: { value: new THREE.Color(0x764ba2) } // Deep purple
```

### In `cosmos-sphere.css`:

```css
/* Change title gradient colors */
.title {
    background: linear-gradient(45deg, #667eea 0%, #764ba2 100%);
}
```

## Technical Details

- **Three.js Version**: r128 (loaded from CDN)
- **Custom Shaders**: GLSL vertex and fragment shaders for cosmos effect
- **Performance**: Optimized for 60fps on modern devices
- **Browser Support**: All modern browsers with WebGL support

## Integration into Your Website

To integrate this element into your existing website:

1. Copy the three files to your project directory
2. Include the CSS and JS files in your HTML:
   ```html
   <link rel="stylesheet" href="path/to/cosmos-sphere.css">
   <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
   <script src="path/to/cosmos-sphere.js"></script>
   ```
3. Add the canvas element where you want the sphere:
   ```html
   <canvas id="cosmos-canvas"></canvas>
   ```
4. Customize the styling to match your design

## Browser Requirements

- Modern browser with WebGL support
- JavaScript enabled
- Recommended: Chrome, Firefox, Safari, or Edge (latest versions)

## Performance Tips

- Reduce `particlesCount` for better performance on mobile devices
- Lower the sphere geometry segments for older devices
- Use `renderer.setPixelRatio(1)` instead of device pixel ratio on low-end devices

## License

Free to use and modify for any project.
