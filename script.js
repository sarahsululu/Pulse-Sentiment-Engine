// --- 1. ELEMENT SELECTION ---
const feed = document.getElementById('feed');
const fetchBtn = document.getElementById('fetch-btn');
const spinner = document.getElementById('spinner');
const placeholder = document.querySelector('#placeholder');
const customInput = document.getElementById('custom-mention-input');
const addMentionBtn = document.getElementById('add-mention-btn');

let activeMentions = []; 

const brandData = [
    { text: "SentinelVibe is a game changer for our marketing team. Extremely fast!", source: "Twitter", user: "@marketing_pro" },
    { text: "I'm having trouble connecting the API to my local environment.", source: "Reddit", user: "u/dev_help" },
    { text: "It's okay, but I wish there were more integration options for Slack.", source: "G2", user: "AnonUser" },
    { text: "The UI design is absolute fire. Love the dark mode by default.", source: "LinkedIn", user: "Sarah Chen" },
    { text: "System alert: Response times are lagging during peak hours.", source: "Logs", user: "System" },
    { text: "Solid tool. Does exactly what it says on the box.", source: "ProductHunt", user: "EarlyAdopter" }
];

const determineSentiment = (text) => {
    const positive = ['fast', 'amazing', 'great', 'love', 'seamless', 'impressed', 'speed', 'fire', 'solid'];
    const negative = ['trouble', 'bad', 'lagging', 'crashed', 'slow', 'cluttered', 'lacking'];
    const lowerText = text.toLowerCase();
    
    if (positive.some(word => lowerText.includes(word))) return 'positive';
    if (negative.some(word => lowerText.includes(word))) return 'negative';
    return 'neutral';
};

const renderItems = (items) => {
    if (items.length > 0) {
        placeholder.style.display = 'none'; 
    } else {
        placeholder.style.display = 'block'; 
    }

    const cards = items.map((item) => {
        const sentiment = determineSentiment(item.text); 
        
        const badgeColor = sentiment === 'positive' ? 'bg-emerald-500/10 text-emerald-400' : 
                           sentiment === 'negative' ? 'bg-rose-500/10 text-rose-400' : 'bg-slate-500/10 text-slate-400';

        return `
            <div class="p-6 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between animate-fade-in bg-slate-900 hover:bg-slate-800/40 transition-all group">
                <div class="mb-4 md:mb-0">
                    <div class="flex items-center gap-2 mb-2">
                        <span class="text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-tighter ${badgeColor}">${sentiment}</span>
                        <span class="text-xs text-slate-500 font-mono">${item.source} • ${item.user}</span>
                    </div>
                    <p class="text-slate-200 group-hover:text-white transition-colors">${item.text}</p>
                </div>
            </div>
        `;
    }).join('');
    
    feed.innerHTML = cards;
    updateStats(items); 
};

const updateStats = (items) => {
    const stats = items.reduce((acc, item) => {
        const sentiment = determineSentiment(item.text); 
        acc[sentiment]++;
        return acc;
    }, { positive: 0, neutral: 0, negative: 0 });

    document.getElementById('pos-count').innerText = stats.positive;
    document.getElementById('neu-count').innerText = stats.neutral;
    document.getElementById('neg-count').innerText = stats.negative;
};

const initiateScan = () => {
    fetchBtn.disabled = true;
    fetchBtn.innerText = "Analyzing Streams...";
    spinner.classList.remove('hidden');
    placeholder.querySelector('p').innerText = "Analyzing global mentions...";

    setTimeout(() => {
        activeMentions = [...activeMentions, ...brandData]; 
        renderItems(activeMentions);
        
        fetchBtn.disabled = false;
        fetchBtn.innerText = "Re-Scan Network";
    }, 1500); 
};

window.filterFeed = (type) => {
    if (activeMentions.length === 0) return; 
    
    if (type === 'all') {
        renderItems(activeMentions);
    } else {
        const filtered = activeMentions.filter(m => determineSentiment(m.text) === type);
        renderItems(filtered);
    }
};

const injectCustomMention = () => {
    const text = customInput.value.trim();
    
    if (text === "") {
        customInput.placeholder = "🛑 Error: Text required to run analysis!";
        customInput.classList.add('border-rose-500');
        setTimeout(() => {
            customInput.classList.remove('border-rose-500');
            customInput.placeholder = "Type something nice or critical about SentinelVibe...";
        }, 1500);
        return;
    }

    const newMention = {
        text: text,
        source: "User Input", 
        user: "@me" 
    };

    activeMentions.unshift(newMention);
    
    customInput.value = '';
    renderItems(activeMentions);
};

fetchBtn.addEventListener('click', initiateScan);
addMentionBtn.addEventListener('click', injectCustomMention);

customInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        injectCustomMention();
    }
});