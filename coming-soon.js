/**
 * RIDE Hack 2026 - Interactive Coming Soon Modal
 */
function openComingSoonModal(title, description) {
  var existing = document.getElementById('comingSoonModal');
  if (existing) existing.remove();

  var modalTitle = title || 'Coming Soon';
  var modalDesc = description || 'Application & registration portals for ' + modalTitle + ' are launching shortly for RIDE Hack 2026. Stay tuned!';

  var modalHtml = `
    <div id="comingSoonModal" class="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-all duration-300 animate-fadeIn">
      <div class="relative w-full max-w-lg rounded-3xl bg-gradient-to-b from-[#180a30] via-[#0d061a] to-[#05020a] border border-purple-500/50 p-8 sm:p-10 shadow-[0_0_60px_rgba(168,85,247,0.45)] text-center overflow-hidden">
        <!-- Ambient purple glow -->
        <div class="absolute -top-20 -left-20 w-48 h-48 bg-purple-600/30 rounded-full blur-3xl pointer-events-none"></div>
        <div class="absolute -bottom-20 -right-20 w-48 h-48 bg-indigo-600/30 rounded-full blur-3xl pointer-events-none"></div>
        
        <!-- Close button -->
        <button onclick="closeComingSoonModal()" class="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white flex items-center justify-center transition-all cursor-pointer">
          ✕
        </button>

        <div class="w-16 h-16 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-3xl mx-auto mb-6 shadow-[0_0_25px_rgba(168,85,247,0.4)]">
          ✨
        </div>

        <span class="text-xs uppercase font-extrabold tracking-widest text-purple-300 px-3.5 py-1.5 rounded-full bg-purple-500/20 border border-purple-400/30 inline-block mb-3">
          RIDE Hack 2026
        </span>

        <h3 class="text-2xl sm:text-3xl font-black text-white tracking-tight mb-3">
          ${modalTitle}
        </h3>

        <p class="text-gray-300 text-sm sm:text-base leading-relaxed mb-8">
          ${modalDesc}
        </p>

        <div class="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a href="https://docs.google.com/forms/d/e/1FAIpQLSfo1yDY9sdHcOif3eGItnUyBE8StgveHDqJppyfqZ0NtJaWwg/viewform" target="_blank" rel="noopener noreferrer" class="w-full sm:w-auto px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm transition-all shadow-[0_0_20px_rgba(168,85,247,0.4)]">
            Main Registration Form ↗
          </a>
          <button onclick="closeComingSoonModal()" class="w-full sm:w-auto px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-sm transition-all border border-white/10 cursor-pointer">
            Close
          </button>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHtml);
}

function closeComingSoonModal() {
  var modal = document.getElementById('comingSoonModal');
  if (modal) {
    modal.remove();
  }
}
