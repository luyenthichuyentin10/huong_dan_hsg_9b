/**
 * FILE MÔ PHỎNG: CHE MÁT CHO VƯỜN (CHEVUON - HCM 20-21)
 * Tác giả: Gemini
 */

window.che_M = 0;
window.che_N = 0;
window.che_A = [];
window.che_B = [];
window.che_Lop = [];
window.che_longs = [];
window.che_generator = null;
window.che_auto_timer = null;

function init_hcm2021_chevuon_simulation() {
    const container = document.getElementById('simulation-area');
    if (!container) return;

    container.innerHTML = `
        <div class="step-card border-purple">
            <div class="step-badge bg-purple">Mô phỏng: Phân lô Vườn & Trải bạt 2x2 (Đếm lớp chồng)</div>
            
            <div style="display: flex; gap: 15px; margin-bottom: 20px; align-items: flex-start; flex-wrap: wrap;">
                <div>
                    <textarea id="che-input" style="width: 180px; height: 160px; padding: 5px; font-family: monospace; font-size: 1rem;" placeholder="Nhập M N&#10;Ma trận...">3 2
1 3
8 2
5 8</textarea>
                </div>
                <div style="display: flex; flex-direction: column; gap: 10px; flex: 1;">
                    <div style="display: flex; gap: 10px;">
                        <button onclick="che_random()" class="toggle-btn" style="background:#64748b; color:white; flex:1;">🎲 Random Vườn</button>
                        <button onclick="che_start()" class="toggle-btn" style="background:#0284c7; color:white; flex:1;">🚀 Nạp Dữ Liệu</button>
                    </div>
                    <div style="display: flex; gap: 10px;">
                        <button onclick="che_step()" id="btn-che-step" class="toggle-btn" style="background:#29c702; color:white; flex:1;" disabled>⏭ Trải 1 lọng</button>
                        <button onclick="che_toggle_auto()" id="btn-che-auto" class="toggle-btn" style="background:#8b5cf6; color:white; flex:1;" disabled>▶ Tự động</button>
                    </div>
                    
                    <div style="background: #f8fafc; padding: 10px; border-radius: 8px; border: 1px solid #cbd5e1; max-height:80px; overflow-y:auto; margin-top:5px;">
                        <div style="font-size:0.8rem; font-weight:bold; color:#475569; margin-bottom:5px;">CÂY SAU KHI SORT GIẢM DẦN</div>
                        <div id="che-sorted-array" style="font-family:monospace; font-size:0.9rem; color:#2563eb;">-</div>
                    </div>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1.2fr; gap: 20px; margin-bottom: 20px;">
                <div style="background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; overflow-x: auto;">
                    <div style="font-size:0.85rem; font-weight:bold; color:#1e293b; margin-bottom:10px; text-align:center;">VƯỜN ĐÃ PHÂN LÔ & DỰNG LỌNG</div>
                    <div id="che-grid" style="display: flex; justify-content: center; position: relative;"></div>
                </div>

                <div style="display: flex; flex-direction: column; gap: 10px;">
                    <div style="background: #fffbeb; padding: 15px; border-radius: 8px; border: 1px solid #fde047; flex: 1;">
                        <div style="font-size:0.85rem; font-weight:bold; color:#92400e; margin-bottom: 10px; display:flex; justify-content:space-between;">
                            <span>DANH SÁCH LỌNG</span>
                            <span>TỔNG: <b id="che-res-total">0</b></span>
                        </div>
                        <div id="che-long-list" style="font-family: monospace; font-size: 1rem; color: #b45309; line-height: 1.6; overflow-y:auto; max-height:160px; display:flex; flex-direction:column; gap:4px;">
                        </div>
                    </div>
                </div>
            </div>

            <div id="che-log" style="background: #1e1e1e; color: #d4d4d4; padding: 12px; border-radius: 8px; font-family: monospace; height: 160px; overflow-y: auto; font-size: 0.85rem; line-height: 1.5;">
                > Nhập Vườn và nhấn Nạp...
            </div>
        </div>
    `;
}

function che_log(msg, color = "#d4d4d4") {
    const log = document.getElementById('che-log');
    log.innerHTML += `<div style="color:${color}">> ${msg}</div>`;
    log.scrollTop = log.scrollHeight;
}

function che_random() {
    const M = Math.floor(Math.random() * 3) + 3; // 3-5
    const N = Math.floor(Math.random() * 3) + 3; // 3-5 (Chủ ý cho ra số lẻ để test lọng rìa)
    let text = `${M} ${N}\n`;
    for(let i=0; i<M; i++){
        let row = [];
        for(let j=0; j<N; j++){
            row.push(Math.floor(Math.random() * 20) + 1);
        }
        text += row.join(" ") + "\n";
    }
    document.getElementById('che-input').value = text.trim();
    che_start();
}

function che_start() {
    const lines = document.getElementById('che-input').value.trim().split('\n');
    if (lines.length < 2) return;
    
    clearInterval(window.che_auto_timer);
    document.getElementById('btn-che-auto').innerHTML = "▶ Tự động";
    window.che_auto_timer = null;

    try {
        const [M, N] = lines[0].trim().split(/\s+/).map(Number);
        window.che_M = M;
        window.che_N = N;
        window.che_A = [];
        
        for (let i = 1; i <= M; i++) {
            if (lines[i]) {
                let row = lines[i].trim().split(/\s+/).map(Number);
                window.che_A.push(...row);
            }
        }
    } catch(e) {
        alert("Lỗi định dạng. Dòng 1 ghi M N, tiếp theo là ma trận."); return;
    }

    // Sort giảm dần
    window.che_A.sort((a, b) => b - a);
    document.getElementById('che-sorted-array').innerText = window.che_A.join("  ");

    // Init matrices
    window.che_B = Array.from({length: window.che_M}, () => Array(window.che_N).fill(0));
    window.che_Lop = Array.from({length: window.che_M}, () => Array(window.che_N).fill(0));
    window.che_longs = [];
    
    document.getElementById('che-res-total').innerText = "0";
    document.getElementById('che-long-list').innerHTML = "";
    document.getElementById('che-log').innerHTML = "";
    
    document.getElementById('btn-che-step').disabled = false;
    document.getElementById('btn-che-auto').disabled = false;
    
    che_render_grid();
    window.che_generator = logic_che();
    che_log(`Đã gom và sắp xếp ${window.che_A.length} cây giảm dần.`, "#38bdf8");
}

function che_render_grid(activeCum = null, activeBat = null) {
    const container = document.getElementById('che-grid');
    let html = `<div style="display:grid; grid-template-columns: repeat(${window.che_N}, 40px); gap: 2px;">`;
    
    for(let r=0; r<window.che_M; r++) {
        for(let c=0; c<window.che_N; c++) {
            let val = window.che_B[r][c];
            let displayVal = val > 0 ? val : "";
            
            // Lớp nền (Lọng đè)
            let lop = window.che_Lop[r][c];
            let bg = "white";
            if (lop === 1) bg = "#fef08a"; // Vàng nhạt (1 lọng)
            if (lop === 2) bg = "#fca5a5"; // Cam (2 lọng đè)
            if (lop >= 3) bg = "#f87171"; // Đỏ (Nhiều lọng đè)
            
            let border = "1px solid #cbd5e1";
            let zIndex = 1;
            
            // Highlight cụm (Lỗ trồng cây 2x2)
            if (activeCum && r >= activeCum.r && r <= activeCum.r+1 && c >= activeCum.c && c <= activeCum.c+1) {
                border = "2px dashed #10b981"; // Xanh lá
            }
            
            // Highlight Bạt (Vị trí thật của lọng 2x2)
            if (activeBat && r >= activeBat.r && r <= activeBat.r+1 && c >= activeBat.c && c <= activeBat.c+1) {
                border = "3px solid #0284c7"; // Xanh dương đậm
                zIndex = 10;
            }

            html += `<div style="width:40px; height:40px; display:flex; align-items:center; justify-content:center; background:${bg}; border:${border}; font-weight:bold; font-size:1.1rem; color:#1e293b; z-index:${zIndex}; position:relative;">
                ${displayVal}
                ${lop > 0 ? `<div style="position:absolute; bottom:0; right:2px; font-size:0.5rem; color:#ef4444;">L${lop}</div>` : ''}
            </div>`;
        }
    }
    html += `</div>`;
    container.innerHTML = html;
}

function* logic_che() {
    let M = window.che_M;
    let N = window.che_N;
    let idx = 0;
    let long_id = 1;

    for (let r = 0; r < M; r += 2) {
        for (let c = 0; c < N; c += 2) {
            che_log(`\n--- Xét cụm ${long_id} tại (${r}, ${c}) ---`, "#c084fc");
            
            // 1. Phân bổ cây vào cụm
            let max_tree = 0;
            for (let dr of [0, 1]) {
                for (let dc of [0, 1]) {
                    let nr = r + dr, nc = c + dc;
                    if (nr < M && nc < N) {
                        window.che_B[nr][nc] = window.che_A[idx++];
                        max_tree = Math.max(max_tree, window.che_B[nr][nc]);
                    }
                }
            }
            che_render_grid({r, c}, null);
            che_log(`-> Đã trồng cây. Cây cao nhất cụm: ${max_tree}`, "#10b981");
            yield; // Chờ xem trồng cây

            // 2. Tính vị trí thật của Lọng
            let bat_r = Math.min(r, M - 2 < 0 ? 0 : M - 2); 
            let bat_c = Math.min(c, N - 2 < 0 ? 0 : N - 2);
            
            if (bat_r !== r || bat_c !== c) {
                che_log(`-> Cụm ở rìa! Lọng 2x2 bị dịch vào vị trí thật: (${bat_r}, ${bat_c})`, "#ef4444");
            }

            // 3. Đếm số lớp bạt đè
            let max_lop = 0;
            for (let dr of [0, 1]) {
                for (let dc of [0, 1]) {
                    if (bat_r + dr < M && bat_c + dc < N) {
                        max_lop = Math.max(max_lop, window.che_Lop[bat_r + dr][bat_c + dc]);
                    }
                }
            }

            // 4. Chốt chiều cao & Trải bạt
            let h = max_tree + 1 + max_lop;
            window.che_longs.push(h);
            
            for (let dr of [0, 1]) {
                for (let dc of [0, 1]) {
                    if (bat_r + dr < M && bat_c + dc < N) {
                        window.che_Lop[bat_r + dr][bat_c + dc] = max_lop + 1; // Thêm 1 lớp đè
                    }
                }
            }

            document.getElementById('che-res-total').innerText = window.che_longs.length;
            let listHtml = document.getElementById('che-long-list').innerHTML;
            document.getElementById('che-long-list').innerHTML = listHtml + `<div style="background:white; padding:5px 10px; border-radius:4px; border:1px solid #fde047;">Lọng ${long_id}: <b>Cao ${h}</b> <span style="font-size:0.75rem; color:#94a3b8;">(Max cây: ${max_tree}, Bị đè: ${max_lop})</span></div>`;
            
            che_render_grid(null, {r: bat_r, c: bat_c});
            che_log(`=> Dựng lọng! Chiều cao = ${max_tree} + 1 + ${max_lop}(đè) = ${h}`, "#f59e0b");
            long_id++;
            yield; // Chờ xem bạt đè
        }
    }

    che_render_grid(); // Tắt highlight
    che_log(`\nHOÀN THÀNH TOÀN BỘ VƯỜN! Dùng ${window.che_longs.length} lọng.`, "#fbbf24");
    
    document.getElementById('btn-che-step').disabled = true;
    document.getElementById('btn-che-auto').disabled = true;
    che_toggle_auto(true);
}

function che_step() {
    if (window.che_generator) window.che_generator.next();
}

function che_toggle_auto(forceStop = false) {
    const btn = document.getElementById('btn-che-auto');
    if (window.che_auto_timer || forceStop) {
        clearInterval(window.che_auto_timer);
        window.che_auto_timer = null;
        if (!forceStop) btn.innerHTML = "▶ Tự động";
    } else {
        btn.innerHTML = "⏸ Tạm dừng";
        window.che_auto_timer = setInterval(() => {
            if(window.che_generator) {
                let res = window.che_generator.next();
                if(res.done) che_toggle_auto(true);
            }
        }, 1500); // 1.5s để xem hoạt ảnh bạt đè lên nhau
    }
}