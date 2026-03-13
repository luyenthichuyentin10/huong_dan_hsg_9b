/**
 * FILE MÔ PHỎNG: MẬT THƯ (MATTHU - HCM 22-23)
 * Tác giả: Gemini
 */

window.mt_N = 0;
window.mt_M = 0;
window.mt_K = 0;
window.mt_X = 0;
window.mt_S = "";
window.mt_Options = [];
window.mt_SortedOptions = [];
window.mt_generator = null;
window.mt_auto_timer = null;

function init_hcm2223_matthu_simulation() {
    const container = document.getElementById('simulation-area');
    if (!container) return;

    container.innerHTML = `
        <div class="step-card border-purple">
            <div class="step-badge bg-purple">Mô phỏng: Toán học Hệ Cơ Số (Base-K)</div>
            
            <div style="display: flex; gap: 15px; margin-bottom: 20px; align-items: flex-start; flex-wrap: wrap;">
                <div>
                    <textarea id="mt-input" style="width: 180px; height: 160px; padding: 5px; font-family: monospace; font-size: 0.95rem; letter-spacing: 1px;" placeholder="N M K X&#10;Chuỗi&#10;M dòng options...">16 3 2 6
pro#ramm#ngis#un
ag
iv
ef</textarea>
                </div>
                <div style="display: flex; flex-direction: column; gap: 10px; flex: 1;">
                    <div style="display: flex; gap: 10px;">
                        <button onclick="mt_start()" class="toggle-btn" style="background:#0284c7; color:white; flex:1;">🚀 Nạp Dữ Liệu & Sort</button>
                    </div>
                    <div style="display: flex; gap: 10px;">
                        <button onclick="mt_step()" id="btn-mt-step" class="toggle-btn" style="background:#29c702; color:white; flex:1;" disabled>⏭ Bước tiếp</button>
                        <button onclick="mt_toggle_auto()" id="btn-mt-auto" class="toggle-btn" style="background:#8b5cf6; color:white; flex:1;" disabled>▶ Tự động</button>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 1.5fr 1fr; gap: 10px; margin-top: 5px;">
                        <div style="background: #f8fafc; padding: 10px; border-radius: 8px; border: 1px dashed #cbd5e1; text-align: center;">
                            <div style="font-size:0.8rem; font-weight:bold; color:#0f172a; margin-bottom:5px;">TOÁN HỌC CHIA DƯ (Hệ cơ số K = <span id="lbl-K">-</span>)</div>
                            <div id="mt-math-box" style="font-family:monospace; font-size:1.1rem; color:#b45309; line-height:1.5;">-</div>
                        </div>
                        <div style="background: #fffbeb; padding: 10px; border-radius: 8px; border: 1px solid #fef3c7; text-align: center; display: flex; flex-direction: column; justify-content: center;">
                            <div style="font-size:0.8rem; font-weight:bold; color:#92400e;">GIÁ TRỊ Y (Y = X - 1)</div>
                            <div id="mt-y-val" style="color:#ea580c; font-size: 2rem; font-weight: 900; font-family:monospace;">-</div>
                        </div>
                    </div>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 15px; margin-bottom: 20px;">
                <div style="background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px;">
                    <div style="font-size:0.8rem; font-weight:bold; color:#1e293b; margin-bottom:10px; text-align:center;">CHUỖI KẾT QUẢ</div>
                    <div id="mt-string-display" style="display: flex; flex-wrap: wrap; gap: 4px; justify-content:center;"></div>
                </div>

                <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 15px;">
                    <div style="font-size:0.8rem; font-weight:bold; color:#166534; margin-bottom:10px; text-align:center;">BẢNG LỰA CHỌN (ĐÃ SORT A-Z)</div>
                    <div id="mt-options-display" style="display: flex; flex-direction: column; gap: 6px;"></div>
                </div>
            </div>

            <div id="mt-log" style="background: #1e1e1e; color: #d4d4d4; padding: 12px; border-radius: 8px; font-family: monospace; height: 160px; overflow-y: auto; font-size: 0.85rem; line-height: 1.5;">
                > Nhập Mật thư và nhấn Nạp...
            </div>
        </div>
    `;
}

function mt_log(msg, color = "#d4d4d4") {
    const log = document.getElementById('mt-log');
    log.innerHTML += `<div style="color:${color}">> ${msg}</div>`;
    log.scrollTop = log.scrollHeight;
}

function mt_start() {
    const lines = document.getElementById('mt-input').value.trim().split('\n');
    if (lines.length < 2) return;
    
    clearInterval(window.mt_auto_timer);
    document.getElementById('btn-mt-auto').innerHTML = "▶ Tự động";
    window.mt_auto_timer = null;

    try {
        const [N, M, K, X] = lines[0].trim().split(/\s+/).map(Number);
        window.mt_N = N;
        window.mt_M = M;
        window.mt_K = K;
        window.mt_X = X;
        window.mt_S = lines[1].trim();
        
        window.mt_Options = [];
        window.mt_SortedOptions = [];
        for (let i = 2; i < 2 + M; i++) {
            if (lines[i]) {
                let opt = lines[i].trim();
                window.mt_Options.push(opt);
                // Sort immediately
                window.mt_SortedOptions.push(opt.split('').sort().join(''));
            }
        }
    } catch(e) {
        alert("Lỗi đọc dữ liệu. Đảm bảo đúng định dạng N M K X."); return;
    }

    document.getElementById('lbl-K').innerText = window.mt_K;
    document.getElementById('mt-y-val').innerText = window.mt_X - 1;
    document.getElementById('mt-math-box').innerHTML = "-";
    document.getElementById('mt-log').innerHTML = "";
    
    document.getElementById('btn-mt-step').disabled = false;
    document.getElementById('btn-mt-auto').disabled = false;
    
    mt_render_string(-1);
    mt_render_options(-1, -1);
    
    window.mt_generator = logic_mt();
    mt_log(`Đã nạp Mật thư. Tìm chuỗi thứ X = ${window.mt_X}.`, "#38bdf8");
    mt_log(`-> Chuyển thành Y = X - 1 = <b>${window.mt_X - 1}</b> (Để chạy Index từ 0)`, "#f59e0b");
    mt_log(`-> Toàn bộ bảng Lựa chọn đã tự động sắp xếp A-Z!`, "#10b981");
}

function mt_render_string(activeHashIndex) {
    const container = document.getElementById('mt-string-display');
    let html = '';
    let hashCount = 0; // 0-based from left to right
    
    for (let i = 0; i < window.mt_S.length; i++) {
        let char = window.mt_S[i];
        let bg = "#f1f5f9", color = "#1e293b", border = "1px solid #cbd5e1";
        let transform = "";

        if (char === '#') {
            if (hashCount === activeHashIndex) {
                bg = "#fef08a"; color = "#b45309"; border = "2px solid #f59e0b"; // Vàng (Đang xét)
                transform = "transform: scale(1.15); font-weight:900;";
            } else if (hashCount > activeHashIndex && activeHashIndex !== -1) {
                bg = "#fee2e2"; color = "#ef4444"; border = "2px dashed #ef4444"; // Đỏ nhạt (Chưa xét)
            } else {
                bg = "#dcfce7"; color = "#15803d"; border = "2px solid #22c55e"; // Xanh (Đã xong)
            }
            hashCount++;
        }

        html += `<div style="width: 25px; height: 35px; display: flex; align-items: center; justify-content: center; background: ${bg}; color: ${color}; border: ${border}; border-radius: 4px; font-size: 1.2rem; font-family: monospace; transition: all 0.3s; ${transform}">${char}</div>`;
    }
    container.innerHTML = html;
}

function mt_render_options(activeRow, activeCol) {
    const container = document.getElementById('mt-options-display');
    let html = `<table style="border-collapse: collapse; text-align: center; font-family: monospace; font-size: 1rem; width:100%;">`;
    
    // Header
    html += `<tr><td style="padding: 4px; color:#64748b; font-size:0.8rem;">Dấu # thứ</td>`;
    for(let k=0; k<window.mt_K; k++) html += `<td style="padding: 4px; color:#94a3b8; font-size:0.8rem;">Idx ${k}</td>`;
    html += `</tr>`;

    for (let i = 0; i < window.mt_M; i++) {
        let isRowActive = (i === activeRow);
        let rowBg = isRowActive ? "#fef9c3" : "transparent";
        html += `<tr style="background:${rowBg}; transition:0.3s;">`;
        html += `<td style="padding: 4px; font-weight:bold; color:#475569; border-right:1px solid #cbd5e1;">#${i+1}</td>`;
        
        for (let j = 0; j < window.mt_K; j++) {
            let char = window.mt_SortedOptions[i][j];
            let isCellActive = isRowActive && (j === activeCol);
            let bg = isCellActive ? "#3b82f6" : "white";
            let color = isCellActive ? "white" : "#1e293b";
            let border = isCellActive ? "1px solid #2563eb" : "1px solid #e2e8f0";
            let scale = isCellActive ? "transform: scale(1.15); font-weight:bold;" : "";
            
            html += `<td style="padding: 4px;">
                <div style="width:25px; height:25px; margin:auto; display:flex; align-items:center; justify-content:center; background:${bg}; color:${color}; border:${border}; border-radius:4px; transition:all 0.3s; ${scale}">${char}</div>
            </td>`;
        }
        html += `</tr>`;
    }
    html += `</table>`;
    container.innerHTML = html;
}

function* logic_mt() {
    let Y = window.mt_X - 1;
    let K = window.mt_K;
    let M = window.mt_M;
    let finalStringArray = window.mt_S.split('');
    
    // Tìm vị trí các dấu '#' trong mảng
    let hashPositions = [];
    for(let i=0; i<finalStringArray.length; i++) {
        if(finalStringArray[i] === '#') hashPositions.push(i);
    }

    mt_log(`\n--- BẮT ĐẦU DUYỆT TỪ PHẢI QUA TRÁI ---`, "#c084fc");
    
    for (let i = M - 1; i >= 0; i--) {
        mt_log(`\nXét dấu '#' thứ ${i+1}:`);
        mt_render_string(i); // Highlight the string
        yield;

        let char_idx = Y % K;
        document.getElementById('mt-math-box').innerHTML = `Idx = Y % K = <b style="color:#0284c7;">${Y}</b> % <b style="color:#0284c7;">${K}</b> = <b style="color:#15803d; font-size:1.5rem;">${char_idx}</b>`;
        mt_log(`Chia lấy dư: ${Y} % ${K} = <b>${char_idx}</b>`);
        
        mt_render_options(i, char_idx); // Highlight the option table
        let chosen_char = window.mt_SortedOptions[i][char_idx];
        mt_log(`-> Tra bảng #${i+1} tại Cột ${char_idx} => Bốc chữ <b style="color:#ef4444; font-size:1.2rem;">'${chosen_char}'</b>`);
        yield;

        // Thay chữ
        finalStringArray[hashPositions[i]] = chosen_char;
        window.mt_S = finalStringArray.join('');
        mt_render_string(i); // Re-render to show replaced char in Green
        
        // Tính Y mới
        let oldY = Y;
        Y = Math.floor(Y / K);
        document.getElementById('mt-math-box').innerHTML += `<br>Y mới = Y / K = <b style="color:#0284c7;">${oldY}</b> / <b style="color:#0284c7;">${K}</b> = <b style="color:#ea580c; font-size:1.5rem;">${Y}</b>`;
        document.getElementById('mt-y-val').innerText = Y;
        mt_log(`Cập nhật Y: ${oldY} / ${K} = <b>${Y}</b>. Chuẩn bị qua dấu '#' tiếp theo...`, "#f59e0b");
        yield;
    }

    mt_render_string(-1);
    mt_render_options(-1, -1);
    document.getElementById('mt-math-box').innerHTML = "Hoàn thành!";
    mt_log(`\n=> KẾT QUẢ MẬT THƯ: <b>${window.mt_S}</b>`, "#22c55e");
    
    document.getElementById('btn-mt-step').disabled = true;
    document.getElementById('btn-mt-auto').disabled = true;
    mt_toggle_auto(true);
}

function mt_step() {
    if (window.mt_generator) window.mt_generator.next();
}

function mt_toggle_auto(forceStop = false) {
    const btn = document.getElementById('btn-mt-auto');
    if (window.mt_auto_timer || forceStop) {
        clearInterval(window.mt_auto_timer);
        window.mt_auto_timer = null;
        if (!forceStop) btn.innerHTML = "▶ Tự động";
    } else {
        btn.innerHTML = "⏸ Tạm dừng";
        window.mt_auto_timer = setInterval(() => {
            if(window.mt_generator) {
                let res = window.mt_generator.next();
                if(res.done) mt_toggle_auto(true);
            }
        }, 0); 
    }
}