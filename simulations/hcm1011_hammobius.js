/**
 * FILE MÔ PHỎNG: BÀI HÀM MOBIUS
 * Tên hàm: init_hcm1011_bai2_simulation
 */

// Sử dụng window để cô lập biến giữa các bài học
window.mobius_n = 0;
window.mobius_originalN = 0;
window.mobius_p = 0;
window.mobius_i = 2;
window.mobius_isDone = false;

function init_hcm1011_hammobius_simulation() {
    const container = document.getElementById('simulation-area');
    if (!container) return;

    container.innerHTML = `
        <div class="step-card border-purple">
            <div class="step-badge bg-purple">Mô phỏng: Phân tích Hàm Mobius</div>
            
            <div style="display: flex; gap: 10px; margin-bottom: 20px; align-items: center; flex-wrap: wrap;">
                <div class="input-group">
                    <b>Nhập n:</b> 
                    <input type="number" id="input-mobius-n" value="78" min="1" max="10000" style="width: 80px; margin-left:10px;">
                </div>
                <button onclick="mobius_init()" class="toggle-btn" style="background:#0284c7; color:white;">🚀 Bắt đầu</button>
                <button onclick="mobius_nextStep()" id="btn-step-mobius" class="toggle-btn" style="background:#29c702; color:white;">⏭ Từng bước</button>
                <button onclick="mobius_reset()" class="toggle-btn" style="background:#64748b; color:white;">🔄 Reset</button>
            </div>

            <div class="sim-container" style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                <div style="background: #f8fafc; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0;">
                    <div style="font-weight: bold; margin-bottom: 10px; color: #0c4a6e;">Trạng thái phân tích:</div>
                    <p>Giá trị <b>n</b> hiện tại: <span id="mobius-curr-n" style="font-size: 1.2rem; font-weight: bold; color: #f55e5e;">-</span></p>
                    <p>Đang xét ước <b>i</b>: <span id="mobius-curr-i" style="font-weight: bold; color: #5ee727;">-</span></p>
                    <p>Số lượng ước nguyên tố <b>p</b>: <span id="mobius-curr-p" style="font-weight: bold; color: #e94eee;">0</span></p>
                </div>
                
                <div style="background: #1e1e1e; color: #d4d4d4; padding: 15px; border-radius: 8px; font-family: 'Consolas', monospace;">
                    <div style="color: #6a9955; margin-bottom: 5px;">// Nhật ký phân tích:</div>
                    <div id="mobius-log" style="height: 120px; overflow-y: auto; font-size: 13px; line-height: 1.5;"></div>
                </div>
            </div>

            <div id="mobius-result-area" style="margin-top: 20px; text-align: center; padding: 15px; border-radius: 8px; display: none; border: 1px solid #cbd5e1;">
                <div id="res-math-display" style="font-size: 1.3rem;"></div>
                <div id="res-explain" style="font-style: italic; margin-top: 5px; color: #475569;"></div>
            </div>
        </div>
    `;
    mobius_init();
}

function mobius_log(msg, color = "#d4d4d4") {
    const log = document.getElementById('mobius-log');
    if (log) {
        log.innerHTML += `<div style="color: ${color}">> ${msg}</div>`;
        log.scrollTop = log.scrollHeight;
    }
}

function mobius_init() {
    window.mobius_originalN = parseInt(document.getElementById('input-mobius-n').value) || 1;
    window.mobius_n = window.mobius_originalN;
    window.mobius_p = 0;
    window.mobius_i = 2;
    window.mobius_isDone = false;
    
    document.getElementById('mobius-curr-n').innerText = window.mobius_n;
    document.getElementById('mobius-curr-i').innerText = "-";
    document.getElementById('mobius-curr-p').innerText = "0";
    document.getElementById('mobius-log').innerHTML = "";
    document.getElementById('mobius-result-area').style.display = "none";
    document.getElementById('btn-step-mobius').disabled = false;

    mobius_log(`Khởi tạo n = ${window.mobius_n}`, "#fbbf24");
    
    if (window.mobius_n === 1) {
        mobius_finish(1, "Theo định nghĩa M(1) = 1");
    }
}

function mobius_nextStep() {
    if (window.mobius_isDone) return;

    if (window.mobius_i * window.mobius_i <= window.mobius_n) {
        document.getElementById('mobius-curr-i').innerText = window.mobius_i;
        
        if (window.mobius_n % window.mobius_i === 0) {
            let d = 0;
            while (window.mobius_n % window.mobius_i === 0) {
                d++;
                window.mobius_p++;
                window.mobius_n /= window.mobius_i;
            }
            
            document.getElementById('mobius-curr-n').innerText = window.mobius_n;
            document.getElementById('mobius-curr-p').innerText = window.mobius_p;
            
            if (d > 1) {
                mobius_log(`Ước ${window.mobius_i} xuất hiện ${d} lần (số mũ > 1)`, "#f55e5e");
                mobius_finish(0, `Vì ${window.mobius_i}^${d} là ước của ${window.mobius_originalN}`);
            } else {
                mobius_log(`Tìm thấy ước nguyên tố: ${window.mobius_i}`, "#5ee727");
                window.mobius_i++;
            }
        } else {
            window.mobius_i++;
            // Nếu không phải ước, đệ quy nhẹ để tìm số tiếp theo nhanh hơn
            mobius_nextStep(); 
        }
    } else {
        if (window.mobius_n > 1) {
            window.mobius_p++;
            mobius_log(`Ước nguyên tố cuối cùng: ${window.mobius_n}`, "#5ee727");
            document.getElementById('mobius-curr-n').innerText = 1;
            document.getElementById('mobius-curr-p').innerText = window.mobius_p;
        }
        let result = Math.pow(-1, window.mobius_p);
        mobius_finish(result, `Có ${window.mobius_p} ước nguyên tố phân biệt.`);
    }
}

function mobius_finish(val, reason) {
    window.mobius_isDone = true;
    document.getElementById('btn-step-mobius').disabled = true;
    
    const resArea = document.getElementById('mobius-result-area');
    const mathDisp = document.getElementById('res-math-display');
    resArea.style.display = "block";
    resArea.style.background = val === 0 ? "#fee2e2" : "#f0fdf4";
    
    // Sử dụng MathJax cho kết quả cuối cùng
    if (val === 0) {
        mathDisp.innerHTML = `Kết quả $M(${window.mobius_originalN}) = 0$`;
    } else {
        mathDisp.innerHTML = `Kết quả $M(${window.mobius_originalN}) = (-1)^{${window.mobius_p}} = ${val}$`;
    }

    // Lệnh MathJax render lại phần kết quả
    if (window.MathJax && window.MathJax.typesetPromise) {
        MathJax.typesetPromise([mathDisp]);
    }
    
    document.getElementById('res-explain').innerText = reason;
    mobius_log(`Hoàn thành: M(${window.mobius_originalN}) = ${val}`, "#fbbf24");
}

function mobius_reset() {
    mobius_init();
}