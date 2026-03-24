<div align="center">
  <img src="assets/Quirkatar.jpg" width="972px" alt="Quirkatar - Quirky Avatar Generator" />
  <h1>👾 Quirkatar</h1>
  <p><strong>The weirdest, quirkiest avatar generator on the internet.</strong></p>
  <p>Zero dependencies. Infinite chaos.</p>
  
  <a href="https://nitty-gritty-design.github.io/quirkatar-avatar-generator/">
    <img src="https://img.shields.io/badge/LIVE_DEMO-Try_It_Now-brightgreen?style=for-the-badge&logo=google-chrome" />
  </a>
  <a href="https://www.npmjs.com/package/quirkatar">
    <img src="https://img.shields.io/npm/v/quirkatar?style=for-the-badge&color=cb3837" />
  </a>
  <a href="https://github.com/Nitty-Gritty-Design/quirkatar-avatar-generator/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/Nitty-Gritty-Design/quirkatar-avatar-generator?style=for-the-badge" />
  </a>
</div>

---

## Why Quirkatar?

Tired of boring default avatars? Your users deserve **personality**.

Quirkatar generates hilarious, memorable, and utterly unique avatars from any string. Same seed = same weirdo. Perfect for user profiles, team collabs, or just trolling your friends with cursed profile pics.

![Avatar Grid](assets/Quirkatar_Grid.jpg)

## Features

| Feature | Description |
|---------|-------------|
| 🪶 **Zero Dependencies** | Pure vanilla JS + SVG. No bloat, no network requests, no drama |
| 🎲 **Deterministic Seeds** | `"user@email.com"` always produces the same chaos |
| 😊 **6 Mood Controls** | Happy, sad, angry, surprised, chill, or random |
| 🎨 **4 Color Palettes** | Default, pastel, neon, monochrome |
| 👀 **14 Eye Types** | Normal, cyclops, glasses, stars, hearts, wink, and more |
| 😺 **11 Mouth Styles** | Smiles, fangs, tongues, teeth, zigzags... |
| 👂 **7 Ear Options** | Cat, bear, bunny, alien, elf, robot, or none |
| 🎩 **8 Headwear** | Hats, crowns, horns, headphones, bows |
| 💾 **Download as PNG** | One-click export at 512x512 |
| ⚡ **Lightweight** | ~10KB, loads instantly |

## Quick Start

### Browser (CDN)
```html
<script src="https://unpkg.com/quirkatar"></script>
<div id="avatar"></div>
<script>
  // Random avatar
  document.getElementById('avatar').innerHTML = generateAvatarSvg('your-seed-here');
  
  // Happy avatar with neon colors
  document.getElementById('avatar').innerHTML = generateAvatarSvg('your-seed-here', { 
    mood: 'happy', 
    palette: 'neon',
    size: 200 
  });
</script>
```

### npm
```bash
npm install quirkatar
```

```javascript
import { generateAvatarSvg } from 'quirkatar';

// Generate a 200px happy avatar
const avatar = generateAvatarSvg('hello-world', { 
  size: 200, 
  mood: 'happy',
  palette: 'pastel'
});
document.getElementById('profile').innerHTML = avatar;
```

### Vanilla HTML
Just download `avatar.js` and include it:
```html
<script src="avatar.js"></script>
```

## API

### `generateAvatarSvg(seed, options)`

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `seed` | `string` | *required* | Any string to generate the avatar from |
| `options.size` | `number` | `100` | Width/height in pixels |
| `options.square` | `boolean` | `false` | `true` for square, `false` for circle |
| `options.animated` | `boolean` | `true` | Enable breathing, blinking, twitching animations |
| `options.mood` | `string` | `'random'` | `'random'`, `'happy'`, `'sad'`, `'angry'`, `'surprised'`, `'chill'` |
| `options.palette` | `string` | `'default'` | `'default'`, `'pastel'`, `'neon'`, `'monochrome'` |
| `options.eyebrows` | `boolean` | `true` | Show expressive eyebrows |

**Returns:** SVG string ready to inject into DOM

## Examples

```javascript
// Default avatar
generateAvatarSvg('user123')

// Happy avatar with neon colors
generateAvatarSvg('user123', { mood: 'happy', palette: 'neon' })

// Sad avatar with pastel colors
generateAvatarSvg('user123', { mood: 'sad', palette: 'pastel', size: 200 })

// Large square avatar, no animation
generateAvatarSvg('team-member', { size: 256, square: true, animated: false })

// Use email as seed (consistent across sessions)
generateAvatarSvg('john@company.com', { size: 80, mood: 'chill' })

// Monochrome avatar for professional UI
generateAvatarSvg('user-id', { palette: 'monochrome', mood: 'chill' })
```

## Use Cases

- **User Profiles** - Default avatars that don't suck
- **Team Pages** - Fun avatars for your team directory
- **Comment Systems** - Anonymous but unique identities
- **Game Characters** - Quick character generation
- **Demo Data** - Placeholder avatars that look intentional
- **Social Experiments** - Watch people argue over whose avatar is weirder

## Combos for Days

With the current feature set, Quirkatar can generate:

**8 head shapes × 7 ears × 14 eyes × 11 mouths × 7 accessories × 8 headwear × 3 cheeks × 4 eyebrows × 6 moods × 4 palettes =**

> **~34 million unique avatars**

...and that's not even counting color variations.

## Browser Support

Works everywhere SVG works:
- Chrome/Edge (all versions)
- Firefox (all versions)
- Safari 6+
- Mobile browsers

## Contributing

Found a bug? Want more cursed features? 

1. Fork it
2. Create your feature branch (`git checkout -b feature/amazing`)
3. Commit your changes (`git commit -m 'Add more chaos'`)
4. Push to the branch (`git push origin feature/amazing`)
5. Open a Pull Request

## License

MIT - Do whatever you want. Make the internet weirder. 🎉

---

<p align="center">
  Made with ☕ and questionable design choices by <a href="https://github.com/Nitty-Gritty-Design">Nitty-Gritty-Design</a>
</p>
