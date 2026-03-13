/**
 * FILE MÔ PHỎNG: SỐ ĐỘC LẬP (SODOCLAP - HCM 21-22)
 * Tác giả: Gemini
 */

window.sodo_X = 0n;
window.sodo_generator = null;
window.sodo_auto_timer = null;

function init_hcm2122_sodoclap_simulation() {
    const container = document.getElementById('simulation-area');
    if (!container) return;

    container.innerHTML = `
        <div class="step-card border-purple">
            <div class="step-badge bg-purple">Mô phỏng: Vét cạn Nhảy cóc (Smart Increment)</div>
            
            <div style="display: flex; gap: 15px; margin-bottom: 20px; align-items: center; flex-wrap: wrap;">
                <div>
                    <label style="font-size:0.85rem; color:#64748b; font-weight:bold;">Nhập số nguyên X:</label><br>
                    <input type="text" id="sodo-input" value="2022" style="width:180px; padding:8px; border-radius:4px; border:1px solid #cbd5e1; font-family:monospace; font-size:1.2rem; letter-spacing:2px;">
                </div>
                <div style="display: flex; gap: 10px; margin-top: 20px; flex: 1;">
                    <button onclick="sodo_random()" class="toggle-btn" style="background:#64748b; color:white;">🎲 Random</button>
                    <button onclick="sodo_start()" class="toggle-btn" style="background:#0284c7; color:white; flex:1;">🚀 Bắt đầu</button>
                    <button onclick="sodo_step()" id="btn-sodo-step" class="toggle-btn" style="background:#29c702; color:white; flex:1;" disabled>⏭ Bước tiếp</button>
                    <button onclick="sodo_toggle_auto()" id="btn-sodo-auto" class="toggle-btn" style="background:#8b5cf6; color:white; flex:1;" disabled>▶ Tự động</button>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                <div style="background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px;">
                    <div style="font-size:0.8rem; font-weight:bold; color:#475569; margin-bottom:15px; text-align:center;">SỐ ĐANG XÉT (Y)</div>
                    <div id="sodo-grid" style="display: flex; justify-content: center; gap: 5px; min-height: 50px;"></div>
                    
                    <div style="margin-top:20px; border-top: 1px dashed #cbd5e1; padding-top: 15px;">
                        <div style="font-size:0.8rem; font-weight:bold; color:#0284c7; margin-bottom:5px;">SỔ TAY GHI NHỚ TẦN SUẤT</div>
                        <div id="sodo-mem-grid" style="display:flex; justify-content:center; gap:4px; font-family:monospace; font-size:0.85rem;"></div>
                    </div>
                </div>

                <div style="display: flex; flex-direction: column; gap: 10px;">
                    <div style="background: #f0fdf4; padding: 15px; border-radius: 8px; border: 1px solid #bbf7d0; text-align: center;">
                        <div style="font-size:0.85rem; font-weight:bold; color:#166534; margin-bottom: 5px;">KẾT QUẢ CUỐI CÙNG</div>
                        <div id="sodo-res-final" style="color:#15803d; font-size: 2.5rem; font-weight: 900; font-family:monospace; letter-spacing:3px;">-</div>
                    </div>
                    
                    <div id="sodo-log" style="background: #1e1e1e; color: #d4d4d4; padding: 12px; border-radius: 8px; font-family: monospace; flex: 1; overflow-y: auto; font-size: 0.85rem; line-height: 1.5; min-height: 120px;">
                        > Nhập X và nhấn Bắt đầu...
                    </div>
                </div>
            </div>
        </div>
    `;
}

function sodo_log(msg, color = "#d4d4d4") {
    const log = document.getElementById('sodo-log');
    log.innerHTML += `<div style="color:${color}">> ${msg}</div>`;
    log.scrollTop = log.scrollHeight;
}

function sodo_random() {
    let numStr = "";
    const length = Math.floor(Math.random() * 8) + 2; // 2 to 9 digits
    numStr += (Math.floor(Math.random() * 9) + 1).toString();
    for (let i = 1; i < length; i++) {
        numStr += Math.floor(Math.random() * 10).toString();
    }
    document.getElementById('sodo-input').value = numStr;
    sodo_start();
}

function sodo_start() {
    let val = document.getElementById('sodo-input').value.trim();
    if (!/^\d+$/.test(val) || val === '0') {
        alert("X không hợp lệ. Phải là số nguyên dương."); return;
    }
    window.sodo_X = BigInt(val);

    clearInterval(window.sodo_auto_timer);
    document.getElementById('btn-sodo-auto').innerHTML = "▶ Tự động";
    window.sodo_auto_timer = null;

    document.getElementById('sodo-res-final').innerText = "-";
    document.getElementById('sodo-log').innerHTML = "";
    
    document.getElementById('btn-sodo-step').disabled = false;
    document.getElementById('btn-sodo-auto').disabled = false;
    
    window.sodo_generator = logic_sodo();
    sodo_log(`Tìm số độc lập lớn hơn ${window.sodo_X}...`, "#38bdf8");
    sodo_step();
}

function sodo_render_digits(strNum, activeIdx = -1, dupIdx = -1) {
    const container = document.getElementById('sodo-grid');
    let html = '';
    
    for (let i = 0; i < strNum.length; i++) {
        let bg = "#f1f5f9", color = "#1e293b", border = "1px solid #cbd5e1";
        let transform = "";

        if (i === activeIdx) {
            bg = "#fef08a"; color = "#b45309"; border = "2px solid #f59e0b"; // Vàng (Đang xét)
            transform = "transform: scale(1.1);";
        }
        if (i === dupIdx) {
            bg = "#fee2e2"; color = "#b91c1c"; border = "2px solid #ef4444"; // Đỏ (Bị trùng)
            transform = "transform: scale(1.15); font-weight:900;";
        } else if (dupIdx !== -1 && i < dupIdx) {
            bg = "#dcfce7"; color = "#15803d"; border = "1px solid #22c55e"; // Xanh (Đã OK phần đầu)
        } else if (dupIdx === -1 && activeIdx === -2) {
            bg = "#dcfce7"; color = "#15803d"; border = "2px solid #22c55e"; // Xanh toàn bộ (Hoàn thành)
            transform = "transform: scale(1.05); font-weight:900;";
        }

        html += `<div style="width: 35px; height: 45px; display: flex; align-items: center; justify-content: center; background: ${bg}; color: ${color}; border: ${border}; border-radius: 6px; font-size: 1.5rem; font-family: monospace; font-weight: bold; transition: all 0.3s; ${transform}">${strNum[i]}</div>`;
    }
    container.innerHTML = html;
}

function sodo_render_mem(seenMask) {
    const container = document.getElementById('sodo-mem-grid');
    let html = '';
    for(let i=0; i<=9; i++) {
        let isSeen = (seenMask & (1 << i)) !== 0;
        let bg = isSeen ? "#3b82f6" : "transparent";
        let color = isSeen ? "white" : "#94a3b8";
        let border = isSeen ? "1px solid #2563eb" : "1px dashed #cbd5e1";
        html += `<div style="width:20px; height:20px; display:flex; align-items:center; justify-content:center; background:${bg}; color:${color}; border:${border}; border-radius:3px;">${i}</div>`;
    }
    container.innerHTML = html;
}

function* logic_sodo() {
    let N = window.sodo_X + 1n;

    while (true) {
        let s = N.toString();
        sodo_log(`\n--- Kiểm tra Y = <b>${s}</b> ---`, "#c084fc");
        
        let dupIdx = -1;
        let seen = 0;
        
        // Quét từng chữ số
        for (let i = 0; i < s.length; i++) {
            sodo_render_digits(s, i, -1);
            sodo_render_mem(seen);
            yield; // Dừng nhịp đọc
            
            let digit = s[i] - '0';
            if ((seen & (1 << digit)) !== 0) {
                dupIdx = i;
                sodo_render_digits(s, -1, i);
                sodo_render_mem(seen);
                sodo_log(`=> PHÁT HIỆN TRÙNG! Số '${digit}' xuất hiện lần thứ 2 tại vị trí ${i}.`, "#ef4444");
                yield;
                break;
            }
            seen |= (1 << digit);
        }

        if (dupIdx === -1) {
            // Không có trùng lặp
            sodo_render_digits(s, -2, -1);
            sodo_render_mem(seen);
            document.getElementById('sodo-res-final').innerText = s;
            sodo_log(`\n=> CÁC CHỮ SỐ ĐỀU KHÁC NHAU! CHỐT ĐÁP ÁN: <b>${s}</b>`, "#22c55e");
            break;
        }

        // Kỹ thuật Nhảy cóc
        sodo_log(`* Kỹ thuật Nhảy cóc (Bỏ qua vét cạn):`, "#f59e0b");
        
        // 1. Cắt phần đầu
        let prefixStr = s.substring(0, dupIdx + 1);
        let tailLen = s.length - 1 - dupIdx;
        
        sodo_log(`1. Giữ phần đầu chứa số bị trùng: "${prefixStr}"`);
        yield;
        
        // 2. Tăng giá trị
        let newPrefixVal = BigInt(prefixStr) + 1n;
        sodo_log(`2. Tăng phần đầu lên 1: "${prefixStr}" -> "${newPrefixVal}"`);
        yield;
        
        // 3. Ghép số 0
        let zeroTail = "0".repeat(tailLen);
        let newS = newPrefixVal.toString() + zeroTail;
        sodo_log(`3. Thêm ${tailLen} số '0' vào đuôi -> Nhảy vọt lên <b>${newS}</b>`, "#10b981");
        
        N = BigInt(newS);
        yield;
    }

    document.getElementById('btn-sodo-step').disabled = true;
    document.getElementById('btn-sodo-auto').disabled = true;
    sodo_toggle_auto(true);
}

function sodo_step() {
    if (window.sodo_generator) window.sodo_generator.next();
}

function sodo_toggle_auto(forceStop = false) {
    const btn = document.getElementById('btn-sodo-auto');
    if (window.sodo_auto_timer || forceStop) {
        clearInterval(window.sodo_auto_timer);
        window.sodo_auto_timer = null;
        if (!forceStop) btn.innerHTML = "▶ Tự động";
    } else {
        btn.innerHTML = "⏸ Tạm dừng";
        window.sodo_auto_timer = setInterval(() => {
            if(window.sodo_generator) {
                let res = window.sodo_generator.next();
                if(res.done) sodo_toggle_auto(true);
            }
        }, 0);
    }
}