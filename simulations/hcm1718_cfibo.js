/**
 * FILE MÔ PHỎNG: SỐ LƯỢNG SỐ FIBONACCI (CFIBO - HCM 17-18)
 * Tác giả: Gemini
 */

window.cfibo_a = 0n;
window.cfibo_b = 0n;
window.cfibo_generator = null;
window.cfibo_auto_timer = null;

function init_hcm1718_cfibo_simulation() {
    const container = document.getElementById('simulation-area');
    if (!container) return;

    container.innerHTML = `
        <div class="step-card border-purple">
            <div class="step-badge bg-purple">Mô phỏng: Quét tìm số Fibonacci trong đoạn [A, B]</div>
            
            <div style="display: flex; gap: 15px; margin-bottom: 20px; align-items: center; flex-wrap: wrap;">
                <div>Cận dưới A: <input type="text" id="cfibo-a" value="2" style="width:100px; padding:5px; border-radius:4px; border:1px solid #cbd5e1;"></div>
                <div>Cận trên B: <input type="text" id="cfibo-b" value="100" style="width:120px; padding:5px; border-radius:4px; border:1px solid #cbd5e1;"></div>
                
                <div style="display: flex; gap: 10px;">
                    <button onclick="cfibo_start()" class="toggle-btn" style="background:#0284c7; color:white;">🚀 Bắt đầu</button>
                    <button onclick="cfibo_step()" id="btn-cfibo-step" class="toggle-btn" style="background:#29c702; color:white;" disabled>⏭ Sinh số tiếp</button>
                    <button onclick="cfibo_toggle_auto()" id="btn-cfibo-auto" class="toggle-btn" style="background:#8b5cf6; color:white;" disabled>▶ Tự động</button>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 20px; margin-bottom: 20px;">
                <div style="background: white; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0; display:flex; flex-direction:column; align-items:center;">
                    <div style="font-weight:bold; color:#64748b; margin-bottom:15px; text-align:center;">BIẾN LƯU TRỮ HIỆN TẠI</div>
                    
                    <div style="display:flex; justify-content:space-between; width:100%; margin-bottom:10px;">
                        <span style="color:#64748b;">f1 (Cũ):</span>
                        <b id="cfibo-f1" style="font-family:monospace; color:#475569;">-</b>
                    </div>
                    <div style="display:flex; justify-content:space-between; width:100%; margin-bottom:15px;">
                        <span style="color:#64748b;">f2 (Trước):</span>
                        <b id="cfibo-f2" style="font-family:monospace; color:#0284c7;">-</b>
                    </div>
                    
                    <div style="width:100%; height:2px; background:#e2e8f0; margin-bottom:15px;"></div>
                    
                    <div style="font-size:0.9rem; color:#64748b; margin-bottom:5px;">fn MỚI = f1 + f2</div>
                    <div id="cfibo-fn" style="font-size:2rem; font-weight:900; color:#ea580c; font-family:monospace; text-align:center; word-break: break-all;">-</div>
                </div>

                <div style="background: #f8fafc; padding: 15px; border-radius: 8px; border: 1px solid #cbd5e1; display:flex; flex-direction:column;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                        <div style="font-weight:bold; color:#1e293b;">Dãy Fibonacci đã sinh</div>
                        <div style="background:#ecfdf5; border:1px solid #a7f3d0; padding:5px 15px; border-radius:20px; color:#15803d; font-weight:bold;">
                            Đã tìm thấy: <span id="cfibo-res" style="font-size:1.2rem;">0</span> số
                        </div>
                    </div>
                    
                    <div id="cfibo-tape" style="display:flex; gap:8px; flex-wrap:wrap; max-height:180px; overflow-y:auto; padding:5px;">
                        </div>
                </div>
            </div>

            <div id="cfibo-log" style="background: #1e1e1e; color: #d4d4d4; padding: 12px; border-radius: 8px; font-family: monospace; height: 140px; overflow-y: auto; font-size: 0.85rem; line-height: 1.5;">
                > Nhập khoảng [A, B] và nhấn Bắt đầu...
            </div>
        </div>
    `;
}

function cfibo_log(msg, color = "#d4d4d4") {
    const log = document.getElementById('cfibo-log');
    log.innerHTML += `<div style="color:${color}">> ${msg}</div>`;
    log.scrollTop = log.scrollHeight;
}

function cfibo_start() {
    try {
        window.cfibo_a = BigInt(document.getElementById('cfibo-a').value.trim());
        window.cfibo_b = BigInt(document.getElementById('cfibo-b').value.trim());
        if (window.cfibo_a < 0n || window.cfibo_b < window.cfibo_a) {
            throw new Error("Invalid Range");
        }
    } catch(e) {
        alert("Khoảng [A, B] không hợp lệ. Hãy chắc chắn A <= B và là số nguyên.");
        return;
    }

    clearInterval(window.cfibo_auto_timer);
    document.getElementById('btn-cfibo-auto').innerHTML = "▶ Tự động";
    window.cfibo_auto_timer = null;

    document.getElementById('cfibo-tape').innerHTML = "";
    document.getElementById('cfibo-res').innerText = "0";
    document.getElementById('cfibo-log').innerHTML = "";
    
    document.getElementById('btn-cfibo-step').disabled = false;
    document.getElementById('btn-cfibo-auto').disabled = false;

    window.cfibo_generator = logic_cfibo();
    cfibo_log(`Mục tiêu: Đếm các số Fibonacci phân biệt thuộc đoạn [${window.cfibo_a}, ${window.cfibo_b}].`, "#38bdf8");
    cfibo_step();
}

function add_to_tape(val, status) {
    const tape = document.getElementById('cfibo-tape');
    let bg = "#f1f5f9", color = "#64748b", border = "#cbd5e1"; // Quá bé (< A)
    
    if (status === 'match') {
        bg = "#dcfce7"; color = "#15803d"; border = "#22c55e"; // Nằm trong đoạn [A, B]
    } else if (status === 'over') {
        bg = "#fee2e2"; color = "#b91c1c"; border = "#ef4444"; // Vượt quá B
    } else if (status === 'duplicate') {
        bg = "#f3f4f6"; color = "#9ca3af"; border = "#d1d5db"; // Trùng lặp (ví dụ f(2) = 1)
    }

    let scaleAnim = status === 'match' ? 'transform: scale(1.05); font-weight:bold;' : '';
    
    const card = document.createElement('div');
    card.style = `background:${bg}; color:${color}; border:1px solid ${border}; padding:6px 12px; border-radius:6px; font-family:monospace; font-size:1.1rem; transition:all 0.3s; ${scaleAnim}`;
    
    if (status === 'duplicate') card.innerHTML = `<s>${val}</s>`;
    else card.innerText = val.toString();
    
    tape.appendChild(card);
    tape.scrollTop = tape.scrollHeight;
}

function* logic_cfibo() {
    let A = window.cfibo_a;
    let B = window.cfibo_b;
    let count = 0;
    
    // Khởi tạo
    let f1 = 0n;
    let f2 = 1n;
    let last_added = -1n; // Biến dùng để tránh đếm trùng giá trị
    
    document.getElementById('cfibo-f1').innerText = "-";
    document.getElementById('cfibo-f2').innerText = "-";
    
    // Quá trình sinh
    let n_idx = 0;
    while (true) {
        let fn;
        if (n_idx === 0) fn = 0n;
        else if (n_idx === 1) fn = 1n;
        else fn = f1 + f2;

        document.getElementById('cfibo-fn').innerText = fn.toString();
        
        let status = 'low';
        if (fn > B) {
            status = 'over';
            add_to_tape(fn, status);
            cfibo_log(`Sinh f(${n_idx}) = ${fn}. Giá trị đã LỚN HƠN B (${B}). Dừng thuật toán!`, "#ef4444");
            break;
        }

        if (fn === last_added) {
            status = 'duplicate';
            add_to_tape(fn, status);
            cfibo_log(`Sinh f(${n_idx}) = ${fn}. Bị trùng lặp giá trị, bỏ qua.`, "#94a3b8");
        } 
        else if (fn >= A && fn <= B) {
            status = 'match';
            count++;
            last_added = fn;
            add_to_tape(fn, status);
            document.getElementById('cfibo-res').innerText = count;
            cfibo_log(`Sinh f(${n_idx}) = ${fn}. Nằm trong đoạn [A, B]. Tăng biến đếm lên ${count}!`, "#10b981");
        } 
        else {
            status = 'low';
            last_added = fn;
            add_to_tape(fn, status);
            cfibo_log(`Sinh f(${n_idx}) = ${fn}. Nhỏ hơn A (${A}), tiếp tục sinh...`);
        }
        
        yield; // Chờ nhịp

        // Cập nhật f1, f2 cho vòng lặp sau
        if (n_idx > 0) {
            f1 = f2;
            f2 = fn;
            document.getElementById('cfibo-f1').innerText = f1.toString();
            document.getElementById('cfibo-f2').innerText = f2.toString();
        }
        n_idx++;
    }
    
    cfibo_log(`HOÀN THÀNH! Tổng cộng có ${count} số Fibonacci phân biệt thỏa mãn.`, "#fbbf24");
    document.getElementById('btn-cfibo-step').disabled = true;
    cfibo_toggle_auto(true);
}

function cfibo_step() {
    if (window.cfibo_generator) {
        window.cfibo_generator.next();
    }
}

function cfibo_toggle_auto(forceStop = false) {
    const btn = document.getElementById('btn-cfibo-auto');
    if (window.cfibo_auto_timer || forceStop) {
        clearInterval(window.cfibo_auto_timer);
        window.cfibo_auto_timer = null;
        if (!forceStop) btn.innerHTML = "▶ Tự động";
    } else {
        btn.innerHTML = "⏸ Tạm dừng";
        window.cfibo_auto_timer = setInterval(() => {
            if(window.cfibo_generator) {
                let res = window.cfibo_generator.next();
                if(res.done) cfibo_toggle_auto(true);
            }
        }, 300); // Tốc độ 300ms để dễ nhìn các số nhảy
    }
}