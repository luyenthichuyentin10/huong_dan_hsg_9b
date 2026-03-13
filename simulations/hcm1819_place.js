/**
 * FILE MÔ PHỎNG: XẾP CHỖ (PLACE - HCM 18-19)
 * Tác giả: Gemini
 */

window.place_N = 0;
window.place_counts = {1:0, 2:0, 3:0, 4:0};
window.place_tables = [];
window.place_generator = null;
window.place_auto_timer = null;

function init_hcm1819_place_simulation() {
    const container = document.getElementById('simulation-area');
    if (!container) return;

    container.innerHTML = `
        <div class="step-card border-purple">
            <div class="step-badge bg-purple">Mô phỏng: Tham lam Xếp bàn (Bin Packing)</div>
            
            <div style="display: flex; gap: 15px; margin-bottom: 20px; align-items: flex-start; flex-wrap: wrap;">
                <div>
                    <textarea id="place-input" style="width: 150px; height: 160px; padding: 5px; font-family: monospace; font-size: 1rem; letter-spacing: 1px;" placeholder="Nhập N&#10;Danh sách s_i...">5
1 2 4 3 3</textarea>
                </div>
                <div style="display: flex; flex-direction: column; gap: 10px; flex: 1;">
                    <div style="display: flex; gap: 10px;">
                        <button onclick="place_random()" class="toggle-btn" style="background:#64748b; color:white; flex:1;">🎲 Test ngẫu nhiên</button>
                        <button onclick="place_start()" class="toggle-btn" style="background:#0284c7; color:white; flex:1;">🚀 Nạp Dữ Liệu</button>
                    </div>
                    <div style="display: flex; gap: 10px;">
                        <button onclick="place_step()" id="btn-place-step" class="toggle-btn" style="background:#29c702; color:white; flex:1;" disabled>⏭ Xếp bàn tiếp</button>
                        <button onclick="place_toggle_auto()" id="btn-place-auto" class="toggle-btn" style="background:#8b5cf6; color:white; flex:1;" disabled>▶ Tự động</button>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 10px; margin-top: 5px;">
                        <div style="background: #f8fafc; padding: 10px; border-radius: 8px; border: 1px solid #cbd5e1; text-align: center;">
                            <div style="font-size:0.8rem; font-weight:bold; color:#475569; margin-bottom:5px;">CÁC NHÓM CHƯA XẾP</div>
                            <div style="display:flex; justify-content:space-around; font-weight:bold;">
                                <div><span style="display:inline-block; width:20px; height:20px; background:#ef4444; color:white; border-radius:3px; line-height:20px;">4</span> : <span id="cnt-4">0</span></div>
                                <div><span style="display:inline-block; width:20px; height:20px; background:#f59e0b; color:white; border-radius:3px; line-height:20px;">3</span> : <span id="cnt-3">0</span></div>
                                <div><span style="display:inline-block; width:20px; height:20px; background:#3b82f6; color:white; border-radius:3px; line-height:20px;">2</span> : <span id="cnt-2">0</span></div>
                                <div><span style="display:inline-block; width:20px; height:20px; background:#10b981; color:white; border-radius:3px; line-height:20px;">1</span> : <span id="cnt-1">0</span></div>
                            </div>
                        </div>
                        <div style="background: #f0fdf4; padding: 10px; border-radius: 8px; border: 1px solid #22c55e; text-align: center; display: flex; flex-direction: column; justify-content: center;">
                            <div style="font-size:0.8rem; font-weight:bold; color:#166534;">SỐ BÀN ĐÃ MỞ</div>
                            <div id="place-res" style="color:#15803d; font-size: 2rem; font-weight: 900;">0</div>
                        </div>
                    </div>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: 1.5fr 1fr; gap: 20px;">
                <div style="background: #fdf8f6; border: 1px dashed #fdba74; border-radius: 8px; padding: 15px; min-height: 200px;">
                    <div style="font-weight:bold; color:#c2410c; margin-bottom: 10px;">KHU VỰC BÀN TIỆC (Mỗi bàn max 4 người)</div>
                    <div id="place-tables-area" style="display: flex; gap: 15px; flex-wrap: wrap; align-items:flex-start;">
                        </div>
                </div>

                <div id="place-log" style="background: #1e1e1e; color: #d4d4d4; padding: 12px; border-radius: 8px; font-family: monospace; height: 220px; overflow-y: auto; font-size: 0.85rem; line-height: 1.5;">
                    > Nhập dữ liệu và nhấn Nạp...
                </div>
            </div>
        </div>
    `;
}

function place_log(msg, color = "#d4d4d4") {
    const log = document.getElementById('place-log');
    log.innerHTML += `<div style="color:${color}">> ${msg}</div>`;
    log.scrollTop = log.scrollHeight;
}

function place_random() {
    const N = Math.floor(Math.random() * 15) + 10; // 10 đến 25 nhóm
    let text = `${N}\n`;
    let arr = [];
    for(let i=0; i<N; i++){
        arr.push(Math.floor(Math.random() * 4) + 1);
    }
    text += arr.join(" ");
    document.getElementById('place-input').value = text.trim();
    place_start();
}

function update_counts_ui() {
    document.getElementById('cnt-1').innerText = window.place_counts[1];
    document.getElementById('cnt-2').innerText = window.place_counts[2];
    document.getElementById('cnt-3').innerText = window.place_counts[3];
    document.getElementById('cnt-4').innerText = window.place_counts[4];
}

function place_start() {
    const lines = document.getElementById('place-input').value.trim().split('\n');
    if (lines.length < 2) return;
    
    clearInterval(window.place_auto_timer);
    document.getElementById('btn-place-auto').innerHTML = "▶ Tự động";
    window.place_auto_timer = null;

    window.place_counts = {1:0, 2:0, 3:0, 4:0};
    window.place_tables = [];
    
    try {
        window.place_N = parseInt(lines[0].trim());
        const arr = lines[1].trim().split(/\s+/).map(Number);
        for(let s of arr) {
            if (s >= 1 && s <= 4) window.place_counts[s]++;
        }
    } catch(e) {
        alert("Lỗi đọc dữ liệu."); return;
    }

    update_counts_ui();
    document.getElementById('place-res').innerText = "0";
    document.getElementById('place-tables-area').innerHTML = "";
    document.getElementById('place-log').innerHTML = "";
    
    document.getElementById('btn-place-step').disabled = false;
    document.getElementById('btn-place-auto').disabled = false;
    
    window.place_generator = logic_place();
    place_log(`Đã nạp ${window.place_N} nhóm học sinh. Sẵn sàng ghép bàn.`, "#38bdf8");
}

function render_tables(highlightIdx = -1) {
    const area = document.getElementById('place-tables-area');
    let html = '';
    
    const colors = {1: "#10b981", 2: "#3b82f6", 3: "#f59e0b", 4: "#ef4444"};
    
    window.place_tables.forEach((table, idx) => {
        let border = idx === highlightIdx ? "2px solid #ef4444" : "1px solid #cbd5e1";
        let shadow = idx === highlightIdx ? "box-shadow: 0 4px 6px -1px rgba(239,68,68,0.3);" : "";
        let scale = idx === highlightIdx ? "transform: scale(1.05);" : "";
        
        let tableHtml = `<div style="background:white; border:${border}; border-radius:50%; width:70px; height:70px; display:flex; flex-wrap:wrap; align-content:center; justify-content:center; gap:2px; padding:8px; transition:all 0.3s; ${shadow} ${scale}">`;
        
        // Vẽ các khối (ghế ngồi)
        table.forEach(groupSize => {
            let width = groupSize > 2 ? "100%" : (groupSize === 2 ? "100%" : "40%");
            let height = groupSize > 2 ? `${groupSize * 15}px` : (groupSize === 2 ? "30px" : "40%");
            if(groupSize === 1 && table.length > 2) { width = "40%"; height = "40%"; } // Cho khít nếu toàn 1
            
            // Flex block representation
            tableHtml += `<div style="background:${colors[groupSize]}; width:${width}; height:${height}; border-radius:4px; display:flex; align-items:center; justify-content:center; color:white; font-size:0.7rem; font-weight:bold;">${groupSize}</div>`;
        });
        tableHtml += `</div>`;
        html += tableHtml;
    });
    
    area.innerHTML = html;
    document.getElementById('place-res').innerText = window.place_tables.length;
}

function* logic_place() {
    let counts = window.place_counts;
    
    // XỬ LÝ NHÓM 4
    if (counts[4] > 0) {
        place_log(`\n--- BƯỚC 1: XẾP NHÓM 4 NGƯỜI ---`, "#c084fc");
        while (counts[4] > 0) {
            window.place_tables.push([4]);
            counts[4]--;
            update_counts_ui();
            render_tables(window.place_tables.length - 1);
            place_log(`+ Mở 1 bàn cho nhóm 4 người (Bàn đầy).`);
            yield;
        }
    }

    // XỬ LÝ NHÓM 3
    if (counts[3] > 0) {
        place_log(`\n--- BƯỚC 2: XẾP NHÓM 3 NGƯỜI ---`, "#c084fc");
        while (counts[3] > 0) {
            let table = [3];
            counts[3]--;
            place_log(`+ Mở 1 bàn cho nhóm 3 người. Còn trống 1 chỗ.`);
            
            if (counts[1] > 0) {
                table.push(1);
                counts[1]--;
                place_log(`  -> Ghép thêm 1 nhóm 1 người vào lấp chỗ.`, "#10b981");
            }
            window.place_tables.push(table);
            update_counts_ui();
            render_tables(window.place_tables.length - 1);
            yield;
        }
    }

    // XỬ LÝ NHÓM 2
    if (counts[2] > 0) {
        place_log(`\n--- BƯỚC 3: XẾP NHÓM 2 NGƯỜI ---`, "#c084fc");
        while (counts[2] >= 2) {
            window.place_tables.push([2, 2]);
            counts[2] -= 2;
            place_log(`+ Mở 1 bàn, ghép vừa khít 2 nhóm 2 người.`);
            update_counts_ui();
            render_tables(window.place_tables.length - 1);
            yield;
        }
        
        if (counts[2] === 1) {
            let table = [2];
            counts[2]--;
            place_log(`+ Mở 1 bàn cho 1 nhóm 2 người bị lẻ. Còn trống 2 chỗ.`);
            
            let filled = 0;
            while (counts[1] > 0 && filled < 2) {
                table.push(1);
                counts[1]--;
                filled++;
            }
            if(filled > 0) place_log(`  -> Ghép thêm ${filled} nhóm 1 người vào lấp chỗ.`, "#10b981");
            
            window.place_tables.push(table);
            update_counts_ui();
            render_tables(window.place_tables.length - 1);
            yield;
        }
    }

    // XỬ LÝ NHÓM 1
    if (counts[1] > 0) {
        place_log(`\n--- BƯỚC 4: GOM CÁC NHÓM 1 NGƯỜI CÒN LẠI ---`, "#c084fc");
        while (counts[1] > 0) {
            let table = [];
            let capacity = 4;
            while (counts[1] > 0 && capacity > 0) {
                table.push(1);
                counts[1]--;
                capacity--;
            }
            window.place_tables.push(table);
            place_log(`+ Mở 1 bàn gom ${4 - capacity} nhóm 1 người.`);
            update_counts_ui();
            render_tables(window.place_tables.length - 1);
            yield;
        }
    }

    render_tables(-1); // Tắt highlight
    place_log(`\nHOÀN THÀNH! Tổng số bàn cần thiết: ${window.place_tables.length}`, "#fbbf24");
    document.getElementById('btn-place-step').disabled = true;
    document.getElementById('btn-place-auto').disabled = true;
    place_toggle_auto(true);
}

function place_step() {
    if (window.place_generator) window.place_generator.next();
}

function place_toggle_auto(forceStop = false) {
    const btn = document.getElementById('btn-place-auto');
    if (window.place_auto_timer || forceStop) {
        clearInterval(window.place_auto_timer);
        window.place_auto_timer = null;
        if (!forceStop) btn.innerHTML = "▶ Tự động";
    } else {
        btn.innerHTML = "⏸ Tạm dừng";
        window.place_auto_timer = setInterval(() => {
            if(window.place_generator) {
                let res = window.place_generator.next();
                if(res.done) place_toggle_auto(true);
            }
        }, 800); 
    }
}