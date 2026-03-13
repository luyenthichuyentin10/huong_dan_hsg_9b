/**
 * FILE MÔ PHỎNG: ĐỈNH ĐỒI (TOP - HCM 16-17)
 * Cập nhật: Nút Random ma trận, BFS vs DFS, mã giả đổi CHO -> LẶP
 */

window.top_matrix = [];
window.top_N = 0;
window.top_M = 0;
window.top_visited = [];
window.top_state = []; 
window.top_generator = null;
window.top_auto_timer = null;

function init_hcm1617_top_simulation() {
    const container = document.getElementById('simulation-area');
    if (!container) return;

    container.innerHTML = `
        <div class="step-card border-purple">
            <div class="step-badge bg-purple">Mô phỏng Tìm kiếm Đỉnh đồi (BFS vs DFS)</div>
            
            <div style="display: flex; gap: 15px; margin-bottom: 15px; align-items: flex-start; flex-wrap: wrap;">
                <div>
                    <textarea id="top-input" style="width: 200px; height: 180px; padding: 5px; font-family: monospace;" placeholder="Nhập N M và ma trận...">8 7
4 3 2 2 1 0 1
3 3 3 2 1 0 1
2 2 2 2 1 0 0
2 1 1 1 1 0 0
1 1 0 0 0 1 0
0 0 0 1 1 1 0
0 1 2 2 1 1 0
0 1 1 1 2 1 0</textarea>
                </div>
                <div style="display: flex; flex-direction: column; gap: 8px;">
                    <select id="top-mode" style="padding:5px; border-radius:4px; border:1px solid #cbd5e1;">
                        <option value="bfs">Thuật toán BFS (Hàng đợi - Loang lớp)</option>
                        <option value="dfs">Thuật toán DFS (Ngăn xếp - Đi sâu)</option>
                    </select>
                    <div style="display: flex; gap: 10px;">
                        <button onclick="top_random()" class="toggle-btn" style="background:#64748b; color:white; flex:1;">🎲 Ngẫu nhiên</button>
                        <button onclick="top_start()" class="toggle-btn" style="background:#0284c7; color:white; flex:1;">🚀 Nạp Dữ Liệu</button>
                    </div>
                    <div style="display: flex; gap: 10px;">
                        <button onclick="top_step()" id="btn-top-step" class="toggle-btn" style="background:#29c702; color:white; flex:1;" disabled>⏭ Quét 1 bước</button>
                        <button onclick="top_toggle_auto()" id="btn-top-auto" class="toggle-btn" style="background:#8b5cf6; color:white; flex:1;" disabled>▶ Tự động</button>
                    </div>
                    
                    <div style="background: #fffbeb; padding: 10px; border-radius: 8px; border: 1px solid #fef3c7; text-align: center; margin-top: 5px;">
                        <div style="font-size:0.85rem; font-weight:bold; color:#92400e;">SỐ ĐỈNH ĐỒI TÌM THẤY</div>
                        <div id="top-res" style="color:#ea580c; font-size: 2rem; font-weight: 900;">0</div>
                    </div>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 20px;">
                <div style="background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; overflow-x: auto;">
                    <div id="top-grid" style="display: flex; justify-content: center;"></div>
                </div>

                <div id="top-log" style="background: #1e1e1e; color: #d4d4d4; padding: 12px; border-radius: 8px; font-family: monospace; height: 320px; overflow-y: auto; font-size: 0.8rem; line-height: 1.5;">
                    > Nhập ma trận và nhấn Nạp Dữ Liệu...
                </div>
            </div>
        </div>
    `;
}

function top_log(msg, color = "#d4d4d4") {
    const log = document.getElementById('top-log');
    log.innerHTML += `<div style="color:${color}">> ${msg}</div>`;
    log.scrollTop = log.scrollHeight;
}

function top_random() {
    // Tạo ngẫu nhiên N và M từ 6 đến 10
    const N = Math.floor(Math.random() * 5) + 6;
    const M = Math.floor(Math.random() * 5) + 6;
    let text = `${N} ${M}\n`;
    
    // Đảo bảo tạo ra địa hình mấp mô (số từ 0 đến 5)
    for(let i=0; i<N; i++){
        let row = [];
        for(let j=0; j<M; j++){
            row.push(Math.floor(Math.random() * 6));
        }
        text += row.join(" ") + "\n";
    }
    
    document.getElementById('top-input').value = text.trim();
    top_start(); // Nạp và chạy luôn
}

function top_start() {
    const lines = document.getElementById('top-input').value.trim().split('\n');
    if (lines.length < 2) {
        alert("Dữ liệu không hợp lệ. Vui lòng nhập dòng N M và ma trận.");
        return;
    }
    
    clearInterval(window.top_auto_timer);
    document.getElementById('btn-top-auto').innerHTML = "▶ Tự động";
    window.top_auto_timer = null;

    try {
        const [N, M] = lines[0].trim().split(/\s+/).map(Number);
        window.top_N = N;
        window.top_M = M;
        window.top_matrix = [];
        window.top_visited = Array.from({length: N}, () => Array(M).fill(false));
        window.top_state = Array.from({length: N}, () => Array(M).fill('unvisited'));
        
        for (let i = 1; i <= N; i++) {
            if (lines[i]) window.top_matrix.push(lines[i].trim().split(/\s+/).map(Number));
        }
    } catch(e) {
        alert("Lỗi đọc ma trận. Hãy đảm bảo định dạng đúng.");
        return;
    }

    document.getElementById('top-res').innerText = "0";
    document.getElementById('top-log').innerHTML = "";
    document.getElementById('btn-top-step').disabled = false;
    document.getElementById('btn-top-auto').disabled = false;
    
    top_render();
    window.top_generator = logic_top();
    const modeName = document.getElementById('top-mode').value === 'bfs' ? 'BFS (Hàng đợi)' : 'DFS (Ngăn xếp)';
    top_log(`Đã nạp bản đồ thành công. Sử dụng: ${modeName}`, "#38bdf8");
}

function top_render(component = [], activeStatus = null, currentCell = null) {
    let html = `<table style="border-collapse: collapse; margin: 0 auto; user-select: none;">`;
    for(let i = 0; i < window.top_N; i++) {
        html += `<tr>`;
        for(let j = 0; j < window.top_M; j++) {
            let val = window.top_matrix[i][j];
            let state = window.top_state[i][j];
            
            let bg = "#ffffff", color = "#94a3b8", border = "1px solid #e2e8f0", fw = "normal";
            
            if (state === 'not_top') { bg = "#f1f5f9"; color = "#64748b"; } 
            else if (state === 'top') { bg = "#dcfce7"; color = "#15803d"; fw = "bold"; border = "1px solid #22c55e"; }
            
            let isInside = component.some(([r, c]) => r === i && c === j);
            if (isInside) {
                if (activeStatus === 'scanning') { bg = "#fef08a"; color = "#b45309"; border = "1px solid #f59e0b"; fw = "bold"; } 
                else if (activeStatus === 'top') { bg = "#dcfce7"; color = "#15803d"; fw = "bold"; border = "2px solid #22c55e"; } 
                else if (activeStatus === 'not_top') { bg = "#fee2e2"; color = "#b91c1c"; border = "2px solid #ef4444"; }
            }

            // Điểm chớp sáng (Ô đang được duyệt tại thời điểm hiện tại)
            if (currentCell && currentCell[0] === i && currentCell[1] === j) {
                bg = "#f59e0b"; color = "white"; border = "2px solid #ea580c"; fw = "bold";
                val = "⚲"; // Biểu tượng con trỏ
            }
            
            html += `<td style="width:28px; height:28px; text-align:center; background:${bg}; color:${color}; border:${border}; font-weight:${fw}; font-size:0.85rem; transition: background 0.1s;">${val}</td>`;
        }
        html += `</tr>`;
    }
    html += `</table>`;
    document.getElementById('top-grid').innerHTML = html;
}

function* logic_top() {
    let N = window.top_N;
    let M = window.top_M;
    let tops = 0;
    let isBFS = document.getElementById('top-mode').value === 'bfs';
    
    for (let i = 0; i < N; i++) {
        for (let j = 0; j < M; j++) {
            if (!window.top_visited[i][j]) {
                let h = window.top_matrix[i][j];
                let collection = [[i, j]];
                window.top_visited[i][j] = true;
                let is_top = true;
                let component = [];
                
                top_log(`\n--- Phát hiện vùng mới tại (${i+1}, ${j+1}), độ cao ${h} ---`, "#c084fc");
                
                while (collection.length > 0) {
                    // LÕI KHÁC BIỆT BFS VÀ DFS
                    let [r, c] = isBFS ? collection.shift() : collection.pop();
                    component.push([r, c]);
                    
                    top_render(component, 'scanning', [r, c]);
                    yield; // Tạm dừng để render animation
                    
                    const dirs = [[-1,-1], [-1,0], [-1,1], [0,-1], [0,1], [1,-1], [1,0], [1,1]];
                    for (let [dr, dc] of dirs) {
                        let nr = r + dr, nc = c + dc;
                        if (nr >= 0 && nr < N && nc >= 0 && nc < M) {
                            if (window.top_matrix[nr][nc] > h) {
                                is_top = false;
                            } else if (window.top_matrix[nr][nc] === h && !window.top_visited[nr][nc]) {
                                window.top_visited[nr][nc] = true;
                                collection.push([nr, nc]); // Đẩy vào Hàng đợi hoặc Ngăn xếp
                            }
                        }
                    }
                }

                // Xử lý kết luận cho vùng
                top_render(component, 'scanning', null); // Xóa con trỏ
                if (is_top) {
                    tops++;
                    document.getElementById('top-res').innerText = tops;
                    top_log(`=> KẾT LUẬN: Là Đỉnh đồi!`, "#10b981");
                    component.forEach(([r, c]) => window.top_state[r][c] = 'top');
                    top_render(component, 'top');
                } else {
                    top_log(`=> KẾT LUẬN: Sườn đồi bị loại (Chạm núi cao hơn).`, "#ef4444");
                    component.forEach(([r, c]) => window.top_state[r][c] = 'not_top');
                    top_render(component, 'not_top');
                }
                yield; // Tạm dừng sau khi kết luận 1 vùng
            }
        }
    }
    top_log(`HOÀN THÀNH QUÉT TOÀN BẢN ĐỒ! Đã tìm thấy ${tops} đỉnh đồi.`, "#fbbf24");
    document.getElementById('btn-top-step').disabled = true;
    document.getElementById('btn-top-auto').disabled = true;
    top_toggle_auto(true); // Tắt auto nếu đang bật
}

function top_step() {
    if (window.top_generator) {
        window.top_generator.next();
    }
}

function top_toggle_auto(forceStop = false) {
    const btn = document.getElementById('btn-top-auto');
    if (window.top_auto_timer || forceStop) {
        clearInterval(window.top_auto_timer);
        window.top_auto_timer = null;
        if (!forceStop) btn.innerHTML = "▶ Tự động";
    } else {
        btn.innerHTML = "⏸ Tạm dừng";
        window.top_auto_timer = setInterval(() => {
            if(window.top_generator) {
                let res = window.top_generator.next();
                if(res.done) top_toggle_auto(true);
            }
        }, 100); // Tốc độ quét 100ms/ô
    }
}