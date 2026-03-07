/**
 * FILE MÔ PHỎNG: HOÁN VỊ KẾ TIẾP K LẦN
 * Tên hàm: init_hcm1213_nextk_simulation
 */

window.nextk_arr = [];
window.nextk_k = 0;
window.nextk_count = 0;
window.nextk_state = "ready"; // ready, scanning, swapping, reversing, finished

function init_hcm1213_nextk_simulation() {
    const container = document.getElementById('simulation-area');
    if (!container) return;

    container.innerHTML = `
        <div class="step-card border-purple">
            <div class="step-badge bg-purple">Mô phỏng Hoán vị kế tiếp K lần</div>
            
            <div style="display: flex; gap: 15px; margin-bottom: 20px; align-items: center; flex-wrap: wrap;">
                <div>N: <input type="text" id="nextk-n-input" value="123" style="width:120px; padding:5px;"></div>
                <div>K: <input type="number" id="nextk-k-input" value="2" min="1" style="width:50px; padding:5px;"></div>
                <button onclick="nextk_init()" class="toggle-btn" style="background:#0284c7; color:white;">🚀 Khởi tạo</button>
                <button onclick="nextk_step()" id="btn-nextk-step" class="toggle-btn" style="background:#29c702; color:white;" disabled>⏭ Bước tiếp theo</button>
            </div>

            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0; text-align: center; margin-bottom:20px;">
                <div id="nextk-visual" style="display: flex; justify-content: center; gap: 10px;"></div>
            </div>
            
            <div id="nextk-log" style="background: #1e1e1e; color: #d4d4d4; padding: 15px; border-radius: 8px; font-family: monospace; height: 180px; overflow-y: auto; font-size: 0.9rem;">
                > Nhập N và K để bắt đầu...
            </div>
            <div id="nextk-final" style="text-align: center; margin-top: 15px; font-weight: bold; color: #10b981; font-size: 1.2rem;"></div>
        </div>
    `;
}

function nextk_log(msg, color = "#d4d4d4") {
    const logArea = document.getElementById('nextk-log');
    logArea.innerHTML += `<div style="color: ${color}">> ${msg}</div>`;
    logArea.scrollTop = logArea.scrollHeight;
}

function nextk_init() {
    const nStr = document.getElementById('nextk-n-input').value.trim();
    window.nextk_arr = nStr.split('').map(Number);
    window.nextk_k = parseInt(document.getElementById('nextk-k-input').value);
    window.nextk_count = 0;
    window.nextk_state = "scanning";

    document.getElementById('nextk-log').innerHTML = "";
    document.getElementById('nextk-final').innerHTML = "";
    document.getElementById('btn-nextk-step').disabled = false;
    
    nextk_log(`Bắt đầu tìm hoán vị kế tiếp thứ ${window.nextk_k} của ${nStr}`);
    nextk_render();
}

function nextk_render(highlights = {}) {
    const visual = document.getElementById('nextk-visual');
    visual.innerHTML = window.nextk_arr.map((val, idx) => {
        let bg = "white";
        let color = "#1e293b";
        if (idx === highlights.i) bg = "#fef08a"; // Pivot
        if (idx === highlights.j) bg = "#bae6fd"; // Successor
        if (highlights.range && idx >= highlights.range) bg = "#f0fdf4"; // Reverse range
        
        return `<div style="width:40px; height:50px; display:flex; align-items:center; justify-content:center; border:2px solid #cbd5e1; border-radius:4px; background:${bg}; color:${color}; font-weight:bold; font-size:1.5rem;">${val}</div>`;
    }).join('');
}

function nextk_step() {
    let arr = window.nextk_arr;
    let n = arr.length;

    // Tìm i
    let i = n - 2;
    while (i >= 0 && arr[i] >= arr[i + 1]) i--;

    if (i < 0) {
        nextk_log("Đã đạt hoán vị lớn nhất!", "#f87171");
        document.getElementById('nextk-final').innerText = "Kết quả: " + arr.join('');
        document.getElementById('btn-nextk-step').disabled = true;
        return;
    }

    // Tìm j
    let j = n - 1;
    while (arr[j] <= arr[i]) j--;

    // Hiển thị bước tìm kiếm
    nextk_render({i, j});
    nextk_log(`Bước ${window.nextk_count + 1}: Tìm thấy pivot A[${i}]=${arr[i]} và số thay thế A[${j}]=${arr[j]}`);

    // Hoán đổi
    [arr[i], arr[j]] = [arr[j], arr[i]];

    // Lật ngược
    let left = i + 1, right = n - 1;
    while (left < right) {
        [arr[left], arr[right]] = [arr[right], arr[left]];
        left++; right--;
    }

    window.nextk_count++;
    nextk_log(`Hoán vị thứ ${window.nextk_count}: ${arr.join('')}`, "#5ee727");
    nextk_render({range: i + 1});

    if (window.nextk_count >= window.nextk_k) {
        nextk_log("Đã hoàn thành số bước nhảy K.", "#fbbf24");
        document.getElementById('nextk-final').innerText = "Kết quả: " + arr.join('');
        document.getElementById('btn-nextk-step').disabled = true;
    }
}