/**
 * FILE MÔ PHỎNG: NHÂN KIỂU MỚI (2MULT - HCM 16-17)
 * Tác giả: Gemini
 */

window.mult_a = "";
window.mult_b = "";
window.mult_mode = "vetcan";
window.mult_generator = null;

function init_hcm1617_2multi_simulation() {
    const container = document.getElementById('simulation-area');
    if (!container) return;

    container.innerHTML = `
        <div class="step-card border-purple">
            <div class="step-badge bg-purple">Mô phỏng Nhân kiểu mới (2MULT)</div>
            
            <div style="display: flex; gap: 15px; margin-bottom: 20px; align-items: center; flex-wrap: wrap;">
                <div>Số A: <input type="text" id="mult-a" value="123" style="width:120px; padding:5px; border-radius:4px; border:1px solid #cbd5e1;"></div>
                <div>Số B: <input type="text" id="mult-b" value="45" style="width:120px; padding:5px; border-radius:4px; border:1px solid #cbd5e1;"></div>
                <select id="mult-mode" onchange="mult_switch_mode()" style="padding:5px; border-radius:4px;">
                    <option value="vetcan">Cách 1: Nhân từng cặp (Vét cạn)</option>
                    <option value="toiuu">Cách 2: Nhóm tổng (Tối ưu Toán học)</option>
                </select>
                <button onclick="mult_start()" class="toggle-btn" style="background:#0284c7; color:white;">🚀 Bắt đầu</button>
                <button onclick="mult_step()" id="btn-mult-step" class="toggle-btn" style="background:#29c702; color:white;" disabled>⏭ Bước tiếp</button>
            </div>

            <div class="sim-layout" style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                <div style="background: white; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0; display:flex; flex-direction:column; align-items:center; justify-content:center;">
                    <div style="font-weight:bold; color:#64748b; margin-bottom:15px;">MÔ PHỎNG SỐ HỌC</div>
                    <div id="mult-vis-a" style="display:flex; gap:8px; margin-bottom:10px; font-size:1.5rem; font-family:monospace;">-</div>
                    <div style="color:#94a3b8; font-size:1.5rem;">*</div>
                    <div id="mult-vis-b" style="display:flex; gap:8px; margin-top:10px; font-size:1.5rem; font-family:monospace;">-</div>
                    
                    <div id="mult-vis-math" style="margin-top:20px; font-size:1.2rem; font-weight:bold; color:#0284c7; height:30px;"></div>
                </div>

                <div style="background: #f0fdf4; padding: 15px; border-radius: 8px; border: 1px solid #bbf7d0; text-align:center; display:flex; flex-direction:column; justify-content:center;">
                    <div style="font-weight:bold; color:#166534; margin-bottom:10px;">KẾT QUẢ TỔNG CỘNG</div>
                    <div id="mult-res-val" style="font-size:3.5rem; font-weight:900; color:#15803d; line-height:1;">0</div>
                    <div id="mult-res-expr" style="font-size:0.9rem; color:#065f46; margin-top:15px; font-family:monospace; word-wrap:break-word;">...</div>
                </div>
            </div>

            <div id="mult-log" style="background: #1e1e1e; color: #d4d4d4; padding: 15px; border-radius: 8px; font-family: monospace; height: 160px; overflow-y: auto; font-size: 0.85rem; line-height: 1.5;">
                > Nhập A, B và nhấn Bắt đầu...
            </div>
        </div>
    `;
}

function mult_switch_mode() {
    // Chỉ reset log và vô hiệu hóa nút Next khi đổi chế độ
    document.getElementById('mult-log').innerHTML = "> Đã đổi phương pháp. Nhấn Khởi tạo để chạy lại.";
    document.getElementById('btn-mult-step').disabled = true;
}

function mult_log(msg, color = "#d4d4d4") {
    const logArea = document.getElementById('mult-log');
    logArea.innerHTML += `<div style="color: ${color}">> ${msg}</div>`;
    logArea.scrollTop = logArea.scrollHeight;
}

function render_digits(containerId, str, activeIdx = -1, color = "#475569") {
    const container = document.getElementById(containerId);
    container.innerHTML = str.split('').map((char, i) => {
        let isAct = (i === activeIdx);
        let bg = isAct ? "#fef08a" : "#f1f5f9";
        let bd = isAct ? "#f59e0b" : "#cbd5e1";
        let fW = isAct ? "bold" : "normal";
        let scale = isAct ? "transform: scale(1.1);" : "";
        return `<div style="width:40px; height:40px; display:flex; align-items:center; justify-content:center; border:2px solid ${bd}; border-radius:8px; background:${bg}; color:${color}; font-weight:${fW}; transition:all 0.2s; ${scale}">${char}</div>`;
    }).join('');
}

function mult_start() {
    window.mult_a = document.getElementById('mult-a').value.trim();
    window.mult_b = document.getElementById('mult-b').value.trim();
    window.mult_mode = document.getElementById('mult-mode').value;

    if (!window.mult_a || !window.mult_b || isNaN(window.mult_a) || isNaN(window.mult_b)) {
        alert("Vui lòng nhập A và B là số hợp lệ!");
        return;
    }

    document.getElementById('mult-res-val').innerText = "0";
    document.getElementById('mult-res-expr').innerText = "";
    document.getElementById('mult-log').innerHTML = "";
    document.getElementById('mult-vis-math').innerHTML = "";
    document.getElementById('btn-mult-step').disabled = false;

    render_digits('mult-vis-a', window.mult_a);
    render_digits('mult-vis-b', window.mult_b);

    if (window.mult_mode === 'vetcan') {
        window.mult_generator = logic_2mult_vetcan();
        mult_log("Bắt đầu duyệt từng cặp chữ số (A * B)...", "#38bdf8");
    } else {
        window.mult_generator = logic_2mult_toiuu();
        mult_log("Bắt đầu tính tổng chữ số từng nhóm...", "#38bdf8");
    }
    mult_step();
}

function* logic_2mult_vetcan() {
    let A = window.mult_a;
    let B = window.mult_b;
    let total = 0;
    let expr = "";

    for (let i = 0; i < A.length; i++) {
        for (let j = 0; j < B.length; j++) {
            render_digits('mult-vis-a', A, i, "#ea580c");
            render_digits('mult-vis-b', B, j, "#2563eb");
            
            let valA = parseInt(A[i]);
            let valB = parseInt(B[j]);
            let prod = valA * valB;
            
            document.getElementById('mult-vis-math').innerHTML = `${valA} × ${valB} = <span style="color:#ef4444;">${prod}</span>`;
            
            total += prod;
            expr += (expr === "") ? `${valA}×${valB}` : ` + ${valA}×${valB}`;
            
            document.getElementById('mult-res-val').innerText = total;
            document.getElementById('mult-res-expr').innerText = expr;
            
            mult_log(`Cặp [${valA}, ${valB}] -> Tích: ${prod} | Tổng hiện tại: ${total}`);
            yield;
        }
    }
    
    render_digits('mult-vis-a', A);
    render_digits('mult-vis-b', B);
    document.getElementById('mult-vis-math').innerHTML = "HOÀN THÀNH";
    mult_log(`XONG! Tổng cuối cùng: ${total}`, "#fbbf24");
    document.getElementById('btn-mult-step').disabled = true;
}

function* logic_2mult_toiuu() {
    let A = window.mult_a;
    let B = window.mult_b;
    
    let sumA = 0;
    let exprA = "";
    mult_log("BƯỚC 1: Tính tổng các chữ số của A", "#fbbf24");
    for (let i = 0; i < A.length; i++) {
        render_digits('mult-vis-a', A, i, "#ea580c");
        let valA = parseInt(A[i]);
        sumA += valA;
        exprA += (exprA === "") ? `${valA}` : `+${valA}`;
        document.getElementById('mult-vis-math').innerHTML = `Sum A = ${exprA} = <span style="color:#ef4444;">${sumA}</span>`;
        yield;
    }
    render_digits('mult-vis-a', A); // Reset highlight
    
    let sumB = 0;
    let exprB = "";
    mult_log("BƯỚC 2: Tính tổng các chữ số của B", "#fbbf24");
    for (let j = 0; j < B.length; j++) {
        render_digits('mult-vis-b', B, j, "#2563eb");
        let valB = parseInt(B[j]);
        sumB += valB;
        exprB += (exprB === "") ? `${valB}` : `+${valB}`;
        document.getElementById('mult-vis-math').innerHTML = `Sum B = ${exprB} = <span style="color:#ef4444;">${sumB}</span>`;
        yield;
    }
    render_digits('mult-vis-b', B); // Reset highlight

    mult_log("BƯỚC 3: Nhân hai tổng lại với nhau", "#10b981");
    let total = sumA * sumB;
    document.getElementById('mult-vis-math').innerHTML = `${sumA} × ${sumB} = <span style="color:#15803d;">${total}</span>`;
    document.getElementById('mult-res-val').innerText = total;
    document.getElementById('mult-res-expr').innerText = `(${exprA}) × (${exprB})`;
    
    mult_log(`XONG! ${sumA} × ${sumB} = ${total}`, "#10b981");
    document.getElementById('btn-mult-step').disabled = true;
}

function mult_step() {
    if (window.mult_generator) {
        window.mult_generator.next();
    }
}