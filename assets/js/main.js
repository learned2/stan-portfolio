// Tab management
function showTab(tabName) {
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(function (content) { content.classList.remove('active'); });

    const mainTabs = document.querySelectorAll('.main-tabs .tab');
    mainTabs.forEach(function (tab) { tab.classList.remove('active'); });

    document.getElementById(tabName).classList.add('active');

    if (event && event.target) {
        event.target.classList.add('active');
    }

    if (tabName === 'portfolio') {
        filterProjects('all');
    }
}

// Portfolio filtering
function filterProjects(category) {
    const cards = document.querySelectorAll('.card');
    const filterTags = document.querySelectorAll('.filter-tag');

    filterTags.forEach(function (tag) { tag.classList.remove('active'); });

    if (event && event.target) {
        event.target.classList.add('active');
    }

    cards.forEach(function (card) {
        if (category === 'all' || card.classList.contains(category)) {
            card.classList.add('show');
        } else {
            card.classList.remove('show');
        }
    });
}

// Enhanced Polygon Mesh Background
function PolygonMesh() {
    this.canvas = document.getElementById('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.canvas.width = this.width;
    this.canvas.height = this.height;

    this.gridSize = 100;
    this.points = [];
    this.time = 0;

    this.initializePoints();
    this.animate();

    var self = this;
    window.addEventListener('resize', function () { self.handleResize(); });
}

PolygonMesh.prototype.initializePoints = function () {
    this.points = [];
    var cols = Math.ceil(this.width / this.gridSize) + 2;
    var rows = Math.ceil(this.height / this.gridSize) + 2;

    for (var i = 0; i < rows; i++) {
        this.points[i] = [];
        for (var j = 0; j < cols; j++) {
            this.points[i][j] = {
                x: j * this.gridSize - this.gridSize,
                y: i * this.gridSize - this.gridSize,
                baseX: j * this.gridSize - this.gridSize,
                baseY: i * this.gridSize - this.gridSize,
                z: 0,
                phase: Math.random() * Math.PI * 2,
                amplitude: Math.random() * 40 + 30
            };
        }
    }
};

PolygonMesh.prototype.updatePoints = function () {
    this.time += 0.008;

    for (var i = 0; i < this.points.length; i++) {
        for (var j = 0; j < this.points[i].length; j++) {
            var point = this.points[i][j];

            var wave1 = Math.sin(this.time + point.phase + (point.baseX * 0.008)) * point.amplitude;
            var wave2 = Math.cos(this.time * 0.7 + point.phase + (point.baseY * 0.008)) * (point.amplitude * 0.6);

            point.z = wave1 + wave2;
            point.x = point.baseX + Math.sin(this.time * 0.3 + point.phase) * 15;
            point.y = point.baseY + Math.cos(this.time * 0.2 + point.phase) * 10;
        }
    }
};

PolygonMesh.prototype.drawMesh = function () {
    this.ctx.clearRect(0, 0, this.width, this.height);

    var gradient = this.ctx.createRadialGradient(
        this.width / 2, this.height / 2, 0,
        this.width / 2, this.height / 2, Math.max(this.width, this.height)
    );
    gradient.addColorStop(0, 'rgba(5, 5, 15, 1)');
    gradient.addColorStop(0.5, 'rgba(10, 10, 25, 1)');
    gradient.addColorStop(1, 'rgba(0, 0, 10, 1)');

    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.width, this.height);

    for (var i = 0; i < this.points.length - 1; i++) {
        for (var j = 0; j < this.points[i].length - 1; j++) {
            this.drawTriangle(
                this.points[i][j],
                this.points[i + 1][j],
                this.points[i][j + 1]
            );

            this.drawTriangle(
                this.points[i + 1][j],
                this.points[i + 1][j + 1],
                this.points[i][j + 1]
            );
        }
    }
};

PolygonMesh.prototype.drawTriangle = function (p1, p2, p3) {
    var avgZ = (p1.z + p2.z + p3.z) / 3;
    var distance = Math.abs(avgZ);

    var hue = (this.time * 30 + distance * 1.5) % 360;
    var alpha = Math.max(0.08, Math.min(0.25, 0.18 - distance * 0.0015));

    this.ctx.strokeStyle = 'hsla(' + hue + ', 80%, 65%, ' + alpha + ')';
    this.ctx.lineWidth = Math.max(0.8, 2.0 - distance * 0.006);

    this.ctx.beginPath();
    this.ctx.moveTo(p1.x, p1.y + p1.z * 0.3);
    this.ctx.lineTo(p2.x, p2.y + p2.z * 0.3);
    this.ctx.lineTo(p3.x, p3.y + p3.z * 0.3);
    this.ctx.closePath();
    this.ctx.stroke();

    if (avgZ > 10) {
        this.ctx.fillStyle = 'hsla(' + hue + ', 80%, 65%, ' + (alpha * 0.22) + ')';
        this.ctx.fill();
    }
};

PolygonMesh.prototype.handleResize = function () {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.initializePoints();
};

PolygonMesh.prototype.animate = function () {
    this.updatePoints();
    this.drawMesh();
    var self = this;
    requestAnimationFrame(function () { self.animate(); });
};

// Initialize the polygon mesh background when page loads
document.addEventListener('DOMContentLoaded', function () {
    new PolygonMesh();

    // Autoplay background music
    var audio = document.getElementById('bg-music');
    if (audio) {
        audio.volume = 0.15;

        var tryPlayUnmuted = function () {
            audio.muted = false;
            var p = audio.play();
            if (p && typeof p.catch === 'function') {
                p.catch(function () {
                    startMutedWithFallback();
                });
            }
        };

        var startMutedWithFallback = function () {
            audio.muted = true;
            audio.play();
            // On first interaction, unmute and play
            var oncePlay = function () {
                audio.muted = false;
                audio.play();
                document.removeEventListener('click', oncePlay);
                document.removeEventListener('keydown', oncePlay);
                document.removeEventListener('touchstart', oncePlay);
            };
            document.addEventListener('click', oncePlay, { once: true });
            document.addEventListener('keydown', oncePlay, { once: true });
            document.addEventListener('touchstart', oncePlay, { once: true });
        };

        // Initial attempt to play unmuted
        tryPlayUnmuted();

        // Retry a few times on load/visibility in case of timing quirks
        var retries = 0;
        var maxRetries = 5;
        var retryInterval = setInterval(function () {
            if (!audio.paused && !audio.muted) {
                clearInterval(retryInterval);
                return;
            }
            retries++;
            if (retries > maxRetries) {
                clearInterval(retryInterval);
                return;
            }
            tryPlayUnmuted();
        }, 1500);

        window.addEventListener('load', function () { tryPlayUnmuted(); });
        document.addEventListener('visibilitychange', function () {
            if (!document.hidden) { tryPlayUnmuted(); }
        });
    }
});


