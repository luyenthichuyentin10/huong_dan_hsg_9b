/**
 * FILE MÔ PHỎNG: TẠO CÂU ĐỐ (CAUDO - HCM 19-20)
 * Tác giả: Gemini
 */

window.caudo_N = 0n;
window.caudo_generator = null;
window.caudo_auto_timer = null;

function init_hcm1920_caudo_simulation() {
    const container = document.getElementById('simulation-area');
    if (!container) return;

    container.innerHTML = `
        <div class="step-card border-purple">
            <div class="step-badge bg-purple">Mô phỏng: Chuyển Hệ Thập Phân -> Hệ Nhị Phân</div>
            
            <div style="display: flex; gap: 15px; margin-bottom: 20px; align-items: center; flex-wrap: wrap;">
                <div>
                    <label style="font-size:0.85rem; color:#64748b; font-weight:bold;">Nhập số N (Đến 10^18):</label><br>
                    <input type="text" id="caudo-input" value="18" style="width:200px; padding:8px; border-radius:4px; border:1px solid #cbd5e1; font-family:monospace; font-size:1.1rem;">
                </div>
                <div style="display: flex; gap: 10px; margin-top: 20px; flex: 1;">
                    <button onclick="caudo_random()" class="toggle-btn" style="background:#64748b; color:white;">🎲 Random</button>
                    <button onclick="caudo_start()" class="toggle-btn" style="background:#0284c7; color:white; flex:1;">🚀 Nạp Dữ Liệu</button>
                    <button onclick="caudo_step()" id="btn-caudo-step" class="toggle-btn" style="background:#29c702; color:white; flex:1;" disabled>⏭ Bước tiếp</button>
                    <button onclick="caudo_toggle_auto()" id="btn-caudo-auto" class="toggle-btn" style="background:#8b5cf6; color:white; flex:1;" disabled>▶ Tự động</button>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                <div style="background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; max-height: 250px; overflow-y: auto;">
                    <div style="font-size:0.8rem; font-weight:bold; color:#475569; margin-bottom:10px; text-align:center;">QUÁ TRÌNH CHIA 2 LẤY DƯ</div>
                    <table style="width: 100%; border-collapse: collapse; text-align: center; font-family: monospace; font-size: 0.95rem;" id="caudo-calc-table">
                        <tr style="background: #f1f5f9; color: #475569; font-weight: bold;">
                            <td style="padding: 6px; border: 1px solid #cbd5e1;">N hiện tại</td>
                            <td style="padding: 6px; border: 1px solid #cbd5e1;">Phép tính</td>
                            <td style="padding: 6px; border: 1px solid #cbd5e1;">Phần Dư (Bit)</td>
                        </tr>
                        </table>
                </div>

                <div style="display: flex; flex-direction: column; gap: 10px;">
                    <div style="background: #f8fafc; padding: 10px; border-radius: 8px; border: 1px dashed #cbd5e1;">
                        <div style="font-size:0.8rem; font-weight:bold; color:#64748b; margin-bottom:5px;">MẢNG BITS (Lấy từ dưới lên)</div>
                        <div id="caudo-bits-array" style="display: flex; gap: 5px; min-height: 35px; align-items:center; flex-wrap:wrap;"></div>
                    </div>
                    
                    <div style="background: #fffbeb; padding: 15px; border-radius: 8px; border: 1px solid #fef3c7; text-align: center; flex: 1; display:flex; flex-direction:column; justify-content:center;">
                        <div style="font-size:0.85rem; font-weight:bold; color:#92400e; margin-bottom: 10px;">ĐÁP ÁN (OUTPUT)</div>
                        <div id="caudo-res" style="color:#b45309; font-size: 2.2rem; font-weight: 900; font-family: monospace; letter-spacing: 5px; word-break: break-all;"></div>
                    </div>
                </div>
            </div>

            <div id="caudo-log" style="background: #1e1e1e; color: #d4d4d4; padding: 12px; border-radius: 8px; font-family: monospace; height: 160px; overflow-y: auto; font-size: 0.85rem; line-height: 1.5;">
                > Nhập N và nhấn Nạp Dữ Liệu...
            </div>
        </div>
    `;
}

function caudo_log(msg, color = "#d4d4d4") {
    const log = document.getElementById('caudo-log');
    log.innerHTML += `<div style="color:${color}">> ${msg}</div>`;
    log.scrollTop = log.scrollHeight;
}

function caudo_random() {
    // Generate a random large number using strings to build a BigInt
    let numStr = "";
    const length = Math.floor(Math.random() * 15) + 1; // up to 15 digits
    for (let i = 0; i < length; i++) {
        numStr += Math.floor(Math.random() * 10).toString();
    }
    // Remove leading zeros
    numStr = numStr.replace(/^0+/, '');
    if (numStr === "") numStr = "0";
    
    document.getElementById('caudo-input').value = numStr;
    caudo_start();
}

function caudo_start() {
    try {
        let val = document.getElementById('caudo-input').value.trim();
        if (val === "") throw new Error();
        window.caudo_N = BigInt(val);
        if (window.caudo_N < 0n) throw new Error();
    } catch(e) {
        alert("Giá trị N không hợp lệ. Vui lòng nhập số nguyên không âm.");
        return;
    }

    clearInterval(window.caudo_auto_timer);
    document.getElementById('btn-caudo-auto').innerHTML = "▶ Tự động";
    window.caudo_auto_timer = null;

    // Reset UI
    document.getElementById('caudo-calc-table').innerHTML = `
        <tr style="background: #f1f5f9; color: #475569; font-weight: bold;">
            <td style="padding: 6px; border: 1px solid #cbd5e1;">N hiện tại</td>
            <td style="padding: 6px; border: 1px solid #cbd5e1;">Phép tính</td>
            <td style="padding: 6px; border: 1px solid #cbd5e1; color:#ea580c;">Phần Dư (Bit)</td>
        </tr>
    `;
    document.getElementById('caudo-bits-array').innerHTML = "";
    document.getElementById('caudo-res').innerHTML = "";
    document.getElementById('caudo-log').innerHTML = "";
    
    document.getElementById('btn-caudo-step').disabled = false;
    document.getElementById('btn-caudo-auto').disabled = false;
    
    window.caudo_generator = logic_caudo();
    caudo_log(`Đã nạp N = ${window.caudo_N}. Bắt đầu chuyển hệ Cơ số 2...`, "#38bdf8");
}

function add_calc_row(currentN, divisor, quotient, remainder) {
    const table = document.getElementById('caudo-calc-table');
    const tr = document.createElement('tr');
    tr.style.transition = "background 0.3s";
    tr.style.background = "#fef9c3"; // Highlight color
    tr.innerHTML = `
        <td style="padding: 6px; border: 1px solid #cbd5e1;">${currentN}</td>
        <td style="padding: 6px; border: 1px solid #cbd5e1;">/ 2 = ${quotient}</td>
        <td style="padding: 6px; border: 1px solid #cbd5e1; font-weight:bold; color:#ea580c; font-size:1.1rem;">${remainder}</td>
    `;
    table.appendChild(tr);
    // Remove highlight after a moment
    setTimeout(() => { tr.style.background = "white"; }, 500);
    // Scroll table to bottom
    table.parentElement.scrollTop = table.parentElement.scrollHeight;
}

function render_bits(bitsArray) {
    const container = document.getElementById('caudo-bits-array');
    let html = '';
    bitsArray.forEach(bit => {
        let color = bit === 0n ? "#3b82f6" : "#ef4444";
        html += `<div style="background:${color}; color:white; padding:4px 10px; border-radius:4px; font-weight:bold; font-family:monospace; font-size:1.1rem;">${bit}</div>`;
    });
    container.innerHTML = html;
}

function render_final(bitsArray) {
    const container = document.getElementById('caudo-res');
    let html = '';
    bitsArray.forEach(bit => {
        if (bit === 0n) html += `<span style="color:#2563eb;">O </span>`;
        else html += `<span style="color:#dc2626;">A </span>`;
    });
    container.innerHTML = html.trim();
}

function* logic_caudo() {
    let temp = window.caudo_N;
    let bits = [];

    if (temp === 0n) {
        caudo_log(`N = 0. Trường hợp đặc biệt, trực tiếp mảng bit là [0].`, "#f59e0b");
        bits.unshift(0n);
        add_calc_row("0", 2, "0", "0");
        render_bits(bits);
        yield;
    } else {
        while (temp > 0n) {
            let remainder = temp % 2n;
            let quotient = temp / 2n;
            
            // Push vào đầu mảng (unshift) để tự động đảo ngược chiều từ dưới lên
            bits.unshift(remainder); 
            
            add_calc_row(temp.toString(), 2, quotient.toString(), remainder.toString());
            render_bits(bits);
            caudo_log(`Lấy dư ${temp} % 2 = ${remainder}. Đẩy bit ${remainder} lên đầu mảng.`);
            
            temp = quotient;
            yield; 
        }
    }

    caudo_log(`\nHoàn thành chuyển đổi nhị phân. Độ dài mảng hiện tại: ${bits.length}`, "#c084fc");
    yield;

    // PADDING
    if (bits.length < 5) {
        caudo_log(`Độ dài < 5. Bắt đầu chèn thêm số 0 vào đầu mảng...`, "#f59e0b");
        while (bits.length < 5) {
            bits.unshift(0n);
            render_bits(bits);
            caudo_log(`-> Chèn 1 bit 0 vào đầu. Chiều dài: ${bits.length}`, "#94a3b8");
            yield;
        }
        caudo_log(`Đã đủ 5 ký tự.`, "#10b981");
        yield;
    }

    // MAPPING
    caudo_log(`\n--- ÁNH XẠ KÝ TỰ ---`, "#c084fc");
    caudo_log(`Bit 0 -> Chữ 'O'`, "#3b82f6");
    caudo_log(`Bit 1 -> Chữ 'A'`, "#ef4444");
    
    render_final(bits);
    
    caudo_log(`\nHOÀN THÀNH!`, "#fbbf24");
    document.getElementById('btn-caudo-step').disabled = true;
    document.getElementById('btn-caudo-auto').disabled = true;
    caudo_toggle_auto(true);
}

function caudo_step() {
    if (window.caudo_generator) window.caudo_generator.next();
}

function caudo_toggle_auto(forceStop = false) {
    const btn = document.getElementById('btn-caudo-auto');
    if (window.caudo_auto_timer || forceStop) {
        clearInterval(window.caudo_auto_timer);
        window.caudo_auto_timer = null;
        if (!forceStop) btn.innerHTML = "▶ Tự động";
    } else {
        btn.innerHTML = "⏸ Tạm dừng";
        window.caudo_auto_timer = setInterval(() => {
            if(window.caudo_generator) {
                let res = window.caudo_generator.next();
                if(res.done) caudo_toggle_auto(true);
            }
        }, 800); 
    }
}