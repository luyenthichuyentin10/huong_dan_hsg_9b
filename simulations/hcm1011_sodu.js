/**
 * TẬP TIN MÔ PHỎNG: BÀI SỐ DƯ (HCM 2010-2011)
 * Tên hàm này phải khớp với logic: "init" + lessonId (viết hoa chữ đầu) + "Simulation"
 */

// Các biến trạng thái cô lập cho bài Số dư
window.sodu_numbers = [];
window.sodu_marked = new Array(42).fill(0);
window.sodu_currentIdx = -1;
window.sodu_isAutoPlaying = false;
window.sodu_distinctCount = 0;

function init_hcm1011_sodu_simulation() {
    const container = document.getElementById('simulation-area');
    if (!container) return;

    // Reset trạng thái ban đầu
    window.sodu_numbers = [];
    window.sodu_marked = new Array(42).fill(0);
    window.sodu_currentIdx = -1;
    window.sodu_isAutoPlaying = false;
    window.sodu_distinctCount = 0;

    // Giao diện điều khiển
    container.innerHTML = `
        <div class="step-card border-purple">
            <div class="step-badge bg-purple">Mô phỏng trực quan: Đếm số dư</div>
            
            <div style="display: flex; gap: 10px; margin-bottom: 20px; flex-wrap: wrap;">
                <button onclick="sodu_randomData()" class="toggle-btn" style="background:#0284c7; color:white;">🎲 Random 10 số</button>
                <button onclick="sodu_startAuto()" id="btn-play-sodu" class="toggle-btn">▶ Chạy tự động</button>
                <button onclick="sodu_nextStep()" class="toggle-btn" style="background:#29c702; color:white;">⏭ Từng bước</button>
                <button onclick="sodu_reset()" class="toggle-btn" style="background:#64748b; color:white;">🔄 Reset</button>
            </div>

            <div id="numbers-display" style="display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 20px; min-height: 50px; justify-content: center;">
            </div>

            <div id="sodu-status-msg" style="text-align: center; font-weight: bold; color: #0c4a6e; margin-bottom: 15px; height: 24px;">
                Nhấn nút để bắt đầu.
            </div>

            <div style="overflow-x: auto;">
                <table class="garden-table" id="marking-table" style="margin: 0 auto; border-collapse: collapse;">
                </table>
            </div>

            <div style="text-align: center; margin-top: 20px; font-size: 1.2rem;">
                Số lượng số dư khác nhau: <span id="distinct-count-val" style="color:#c70202; font-weight:900;">0</span>
            </div>
        </div>
    `;

    // Gọi các hàm vẽ sau khi HTML đã được gán vào simulation-area
    sodu_renderTable();
    sodu_randomData();
}

// 1. Vẽ bảng đánh dấu 42 ô
function sodu_renderTable() {
    const table = document.getElementById('marking-table');
    if(!table) return;
    
    let headerRow = '<tr class="idx-row"><td style="background:#e2e8f0">Dư:</td>';
    let valRow = '<tr><td style="font-weight:bold">Đ.Dấu:</td>';
    
    for (let i = 0; i < 42; i++) {
        headerRow += `<td style="font-size: 11px; width: 25px; padding: 4px;">${i}</td>`;
        valRow += `<td id="sodu-cell-${i}" style="font-size: 13px; transition: 0.3s;">0</td>`;
    }
    table.innerHTML = headerRow + '</tr>' + valRow + '</tr>';
}

// 2. Tạo dữ liệu ngẫu nhiên
function sodu_randomData() {
    sodu_reset();
    window.sodu_numbers = Array.from({ length: 10 }, () => Math.floor(Math.random() * 999));
    const display = document.getElementById('numbers-display');
    if(display) {
        display.innerHTML = window.sodu_numbers.map((n, i) => 
            `<div id="sodu-num-${i}" class="step-card" style="padding: 10px; margin: 0; min-width: 45px; text-align: center; border: 1px solid #cbd5e1; background:white">${n}</div>`
        ).join('');
    }
    document.getElementById('sodu-status-msg').innerText = "Đã tạo 10 số ngẫu nhiên.";
}

// 3. Thực hiện từng bước
function sodu_nextStep() {
    if (window.sodu_currentIdx < 9) {
        window.sodu_currentIdx++;
        const val = window.sodu_numbers[window.sodu_currentIdx];
        const remainder = val % 42;
        
        // Highlight số đang xét
        if (window.sodu_currentIdx > 0) {
            document.getElementById(`sodu-num-${window.sodu_currentIdx-1}`).style.background = "#e2e8f0";
        }
        document.getElementById(`sodu-num-${window.sodu_currentIdx}`).style.background = "#fef08a";

        // Cập nhật mảng đánh dấu
        const cell = document.getElementById(`sodu-cell-${remainder}`);
        if (window.sodu_marked[remainder] === 0) {
            window.sodu_marked[remainder] = 1;
            window.sodu_distinctCount++;
            cell.innerText = "1";
            cell.style.background = "#29c702";
            cell.style.color = "white";
            document.getElementById('sodu-status-msg').innerText = `${val} chia 42 dư ${remainder}. Đánh dấu mới!`;
        } else {
            cell.style.transform = "scale(1.3)";
            setTimeout(() => cell.style.transform = "scale(1)", 300);
            document.getElementById('sodu-status-msg').innerText = `${val} chia 42 dư ${remainder}. Đã tồn tại.`;
        }
        
        document.getElementById('distinct-count-val').innerText = window.sodu_distinctCount;
    } else {
        document.getElementById('sodu-status-msg').innerText = "Hoàn thành! Kết quả: " + window.sodu_distinctCount;
        sodu_stopAuto();
    }
}

// 4. Các hàm điều khiển hệ thống
function sodu_reset() {
    sodu_stopAuto();
    window.sodu_currentIdx = -1;
    window.sodu_marked.fill(0);
    window.sodu_distinctCount = 0;
    sodu_renderTable();
    const countEl = document.getElementById('distinct-count-val');
    if(countEl) countEl.innerText = "0";
    if (window.sodu_numbers.length > 0) {
        window.sodu_numbers.forEach((_, i) => {
            const el = document.getElementById(`sodu-num-${i}`);
            if (el) el.style.background = "white";
        });
    }
}

async function sodu_startAuto() {
    if (window.sodu_isAutoPlaying) {
        sodu_stopAuto();
        return;
    }
    window.sodu_isAutoPlaying = true;
    const btn = document.getElementById('btn-play-sodu');
    if(btn) btn.innerText = "⏸ Tạm dừng";
    
    while (window.sodu_isAutoPlaying && window.sodu_currentIdx < 9) {
        sodu_nextStep();
        await new Promise(r => setTimeout(r, 800));
    }
    sodu_stopAuto();
}

function sodu_stopAuto() {
    window.sodu_isAutoPlaying = false;
    const btn = document.getElementById('btn-play-sodu');
    if(btn) btn.innerText = "▶ Chạy tự động";
}