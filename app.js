document.addEventListener('DOMContentLoaded', () => {
    function randomString() {
        return Math.random().toString(36).substring(2, 10);
    }

    let currentSeed = randomString();
    let currentMood = 'random';
    let currentPalette = 'default';
    
    const mainAvatarEl = document.getElementById('main-avatar');
    const footerLogoEl = document.getElementById('footer-logo');
    const seedInput = document.getElementById('seed-input');
    const avatarGrid = document.getElementById('avatar-grid');
    const refreshMainBtn = document.getElementById('refresh-main-btn');
    const copyBtn = document.getElementById('copy-btn');
    const downloadBtn = document.getElementById('download-btn');
    const regenGridBtn = document.getElementById('regenerate-grid-btn');
    const moodSelect = document.getElementById('mood-select');
    const paletteSelect = document.getElementById('palette-select');

    const copyIcon = document.getElementById('copy-icon');
    const checkIcon = document.getElementById('check-icon');
    const copyText = document.getElementById('copy-text');

    function getAvatarOptions(size, animated = true) {
        return {
            size,
            square: false,
            animated,
            mood: currentMood,
            palette: currentPalette
        };
    }

    function renderMainAvatar() {
        mainAvatarEl.classList.add('morphing');

        setTimeout(() => {
            mainAvatarEl.innerHTML = generateAvatarSvg(currentSeed, getAvatarOptions(180));
            seedInput.value = currentSeed;
            mainAvatarEl.classList.remove('morphing');
        }, 300);
    }

    function setSeed(seed) {
        currentSeed = seed;
        renderMainAvatar();
    }

    // Auto-change every 3 seconds
    setInterval(() => {
        if (document.activeElement !== seedInput) {
            setSeed(randomString());
        }
    }, 3000);

    function handleCopy() {
        const svgCode = generateAvatarSvg(currentSeed, getAvatarOptions(120, false));
        navigator.clipboard.writeText(svgCode).then(() => {
            copyIcon.style.display = 'none';
            checkIcon.style.display = 'inline-block';
            copyText.textContent = 'Copied!';

            setTimeout(() => {
                copyIcon.style.display = 'inline-block';
                checkIcon.style.display = 'none';
                copyText.textContent = 'Copy';
            }, 2000);
        }).catch(err => {
            // Fallback for older browsers
            const textarea = document.createElement('textarea');
            textarea.value = svgCode;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            
            copyIcon.style.display = 'none';
            checkIcon.style.display = 'inline-block';
            copyText.textContent = 'Copied!';
            setTimeout(() => {
                copyIcon.style.display = 'inline-block';
                checkIcon.style.display = 'none';
                copyText.textContent = 'Copy';
            }, 2000);
        });
    }

    function handleDownload() {
        const svgCode = generateAvatarSvg(currentSeed, {
            size: 512,
            square: false,
            animated: false,
            mood: currentMood,
            palette: currentPalette
        });
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');
        
        const img = new Image();
        const svgBlob = new Blob([svgCode], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);
        
        img.onload = function() {
            ctx.drawImage(img, 0, 0, 512, 512);
            URL.revokeObjectURL(url);
            
            const pngUrl = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.download = `quirkatar-${currentSeed}.png`;
            link.href = pngUrl;
            link.click();
        };
        
        img.src = url;
    }

    function generateGrid() {
        avatarGrid.innerHTML = '';
        for (let i = 0; i < 24; i++) {
            const seed = randomString();
            const div = document.createElement('div');
            div.className = 'grid-item';

            const svgContainer = document.createElement('div');
            svgContainer.className = 'grid-item-avatar';
            svgContainer.innerHTML = generateAvatarSvg(seed, {
                size: 80,
                square: false,
                animated: false,
                mood: currentMood,
                palette: currentPalette
            });

            const seedText = document.createElement('span');
            seedText.className = 'grid-item-seed';
            seedText.textContent = seed;

            div.appendChild(svgContainer);
            div.appendChild(seedText);

            div.addEventListener('click', () => {
                setSeed(seed);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });

            avatarGrid.appendChild(div);
        }
    }

    // Event Listeners
    seedInput.addEventListener('input', (e) => {
        currentSeed = e.target.value;
        renderMainAvatar();
    });

    refreshMainBtn.addEventListener('click', () => {
        setSeed(randomString());
    });

    copyBtn.addEventListener('click', handleCopy);
    downloadBtn.addEventListener('click', handleDownload);
    regenGridBtn.addEventListener('click', generateGrid);

    moodSelect.addEventListener('change', (e) => {
        currentMood = e.target.value;
        renderMainAvatar();
        generateGrid();
    });

    paletteSelect.addEventListener('change', (e) => {
        currentPalette = e.target.value;
        renderMainAvatar();
        generateGrid();
    });

    // Initialize
    seedInput.value = currentSeed;
    renderMainAvatar();
    generateGrid();

    // Footer Logo
    footerLogoEl.innerHTML = generateAvatarSvg('footer-logo', { size: 48, animated: false });
});
