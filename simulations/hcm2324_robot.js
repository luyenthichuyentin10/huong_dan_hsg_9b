/**
 * FILE MÔ PHỎNG: ROBOT (HCM 23-24)
 * Tác giả: Gemini
 */

window.rb_N = 0;
window.rb_D = 0;
window.rb_a = 0; window.rb_b = 0;
window.rb_c = 0; window.rb_d = 0;
window.rb_mode = 'sub3';

window.rb_generator = null;
window.rb_auto_timer = null;
window.rb_best_path = []; // Lưu các tọa độ để vẽ
window.rb_best_horiz = null; // {x, y, moves}
window.rb_best_vert = null;  // {u, v, moves}

function init_hcm2324_robot_simulation() {
    const container = document.getElementById('simulation-area');
    if (!container) return;

    container.innerHTML = `
        <div class="step-card border-purple">
            <div class="step-badge bg-purple">Mô phỏng: Tách trục tọa độ & Giải phương trình nghiệm nguyên</div>
            
            <div style="display: flex; gap: 15px; margin-bottom: 20px; align-items: flex-start; flex-wrap: wrap;">
                <div>
                    <textarea id="rb-input" style="width: 150px; height: 110px; padding: 5px; font-family: monospace; font-size: 1.1rem; text-align:center;" placeholder="N&#10;a b&#10;c d">5
2 3
1 4</textarea>
                </div>
                <div style="display: flex; flex-direction: column; gap: 10px; flex: 1;">
                    <div style="display: flex; gap: 10px; align-items:center;">
                        <select id="rb-mode" style="padding:8px; border-radius:4px; border:1px solid #cbd5e1; flex:1; font-weight:bold;">
                            <option value="sub3">Cách 3: Tối ưu 1 vòng lặp O(N)</option>
                            <option value="sub2">Cách 2: Vét cạn 2 vòng lặp O(N²)</option>
                        </select>
                        <button onclick="rb_start()" class="toggle-btn" style="background:#0284c7; color:white; flex:1;">🚀 Nạp Dữ Liệu</button>
                    </div>
                    <div style="display: flex; gap: 10px;">
                        <button onclick="rb_step()" id="btn-rb-step" class="toggle-btn" style="background:#29c702; color:white; flex:1;" disabled>⏭ Tìm Trục Ngang (X)</button>
                        <button onclick="rb_toggle_auto()" id="btn-rb-auto" class="toggle-btn" style="background:#8b5cf6; color:white; flex:1;" disabled>▶ Tự động</button>
                    </div>
                    
                    <div style="display: flex; gap: 10px;">
                        <div style="background: #e0f2fe; padding: 10px; border-radius: 8px; border: 1px solid #bae6fd; flex:1; text-align: center;">
                            <div style="font-size:0.8rem; font-weight:bold; color:#0369a1;">TRỤC NGANG (Target = <span id="lbl-DX">-</span>)</div>
                            <div style="font-family:monospace; color:#0284c7; font-weight:bold; margin-top:4px;">x*<span id="lbl-a">-</span> + y*<span id="lbl-b">-</span></div>
                            <div id="rb-res-horiz" style="font-size:1.2rem; font-weight:bold; color:#0c4a6e; mt-2">-</div>
                        </div>
                        <div style="background: #fce7f3; padding: 10px; border-radius: 8px; border: 1px solid #fbcfe8; flex:1; text-align: center;">
                            <div style="font-size:0.8rem; font-weight:bold; color:#be185d;">TRỤC DỌC (Target = <span id="lbl-DY">-</span>)</div>
                            <div style="font-family:monospace; color:#db2777; font-weight:bold; margin-top:4px;">u*<span id="lbl-c">-</span> + v*<span id="lbl-d">-</span></div>
                            <div id="rb-res-vert" style="font-size:1.2rem; font-weight:bold; color:#831843; mt-2">-</div>
                        </div>
                    </div>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                <div style="background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; display:flex; flex-direction:column; align-items:center;">
                    <div style="font-size:0.8rem; font-weight:bold; color:#1e293b; margin-bottom:10px; text-align:center;" id="rb-map-title">SA BÀN ROBOT</div>
                    <div id="rb-grid-map" style="display: flex; justify-content: center; position:relative; max-width:100%; overflow:auto; padding:10px;"></div>
                </div>

                <div style="display: flex; flex-direction: column; gap: 10px;">
                    <div style="background: #f0fdf4; padding: 15px; border-radius: 8px; border: 2px solid #22c55e; text-align: center;">
                        <div style="font-size:0.85rem; font-weight:bold; color:#166534; margin-bottom: 5px;">TỔNG LỆNH CẦN TRUYỀN</div>
                        <div id="rb-res-total" style="color:#15803d; font-size: 2.8rem; font-weight: 900; line-height: 1;">-</div>
                    </div>
                    
                    <div style="background: #fffbeb; padding: 10px; border-radius: 8px; border: 1px solid #fef3c7; flex: 1; display:flex; flex-direction:column;">
                        <div style="font-size:0.8rem; font-weight:bold; color:#92400e; margin-bottom:5px;">NHẬT KÝ THUẬT TOÁN</div>
                        <div id="rb-log" style="font-family: monospace; font-size: 0.85rem; color: #475569; overflow-y: auto; flex:1; min-height: 150px; line-height: 1.6; background:white; padding:8px; border:1px solid #fde68a;"></div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function rb_log(msg, bold = false) {
    const log = document.getElementById('rb-log');
    let fw = bold ? "font-weight:bold; color:#b45309;" : "";
    log.innerHTML += `<div style="border-bottom: 1px solid #fef08a; padding: 3px 0; ${fw}">${msg}</div>`;
    log.scrollTop = log.scrollHeight;
}

function rb_start() {
    const lines = document.getElementById('rb-input').value.trim().split('\n');
    if (lines.length < 3) return;
    
    clearInterval(window.rb_auto_timer);
    document.getElementById('btn-rb-auto').innerHTML = "▶ Tự động";
    window.rb_auto_timer = null;
    window.rb_mode = document.getElementById('rb-mode').value;

    try {
        window.rb_N = parseInt(lines[0].trim());
        const [a, b] = lines[1].trim().split(/\s+/).map(Number);
        const [c, d] = lines[2].trim().split(/\s+/).map(Number);
        window.rb_a = a; window.rb_b = b;
        window.rb_c = c; window.rb_d = d;
        window.rb_D = window.rb_N - 1; // Khoảng cách
        
        if (window.rb_N > 50 && window.rb_mode === 'sub2') {
            alert("Sub 2 (O(N²)) chạy mô phỏng N > 50 sẽ làm đơ trình duyệt. Vui lòng giảm N hoặc chọn Sub 3.");
            return;
        }
    } catch(e) {
        alert("Lỗi định dạng. Dòng 1: N. Dòng 2: a b. Dòng 3: c d."); return;
    }

    // Update UI Labels
    document.getElementById('lbl-DX').innerText = window.rb_D;
    document.getElementById('lbl-DY').innerText = window.rb_D;
    document.getElementById('lbl-a').innerText = window.rb_a;
    document.getElementById('lbl-b').innerText = window.rb_b;
    document.getElementById('lbl-c').innerText = window.rb_c;
    document.getElementById('lbl-d').innerText = window.rb_d;
    
    document.getElementById('rb-res-horiz').innerText = "...";
    document.getElementById('rb-res-vert').innerText = "...";
    document.getElementById('rb-res-total').innerText = "-";
    document.getElementById('rb-log').innerHTML = "";
    document.getElementById('rb-grid-map').innerHTML = "";
    
    window.rb_best_horiz = null;
    window.rb_best_vert = null;
    
    document.getElementById('btn-rb-step').innerText = "⏭ Tìm Trục Ngang (X)";
    document.getElementById('btn-rb-step').disabled = false;
    document.getElementById('btn-rb-auto').disabled = false;

    // Vẽ base map nếu N nhỏ
    rb_render_map([], []);
    
    window.rb_generator = logic_rb_main();
    rb_log(`Đã nạp N=${window.rb_N}. Khoảng cách cần đi: D = N - 1 = ${window.rb_D}`, true);
}

function rb_render_map(horizPath, vertPath) {
    const mapContainer = document.getElementById('rb-grid-map');
    let N = window.rb_N;
    
    if (N > 15) {
        document.getElementById('rb-map-title').innerText = `SA BÀN (N=${N} quá lớn để vẽ, chỉ hiển thị Toán học)`;
        mapContainer.innerHTML = `<div style="color:#94a3b8; font-style:italic;">Kích thước quá lớn, vui lòng xem khung log thuật toán bên cạnh.</div>`;
        return;
    }
    
    document.getElementById('rb-map-title').innerText = `SA BÀN ${N}x${N}`;
    
    // Tạo lưới
    let cellSize = N <= 8 ? 40 : 25;
    let html = `<div style="display:grid; grid-template-columns: repeat(${N}, ${cellSize}px); border: 1px solid #94a3b8; width:fit-content; background:#f8fafc;">`;
    
    // Tọa độ vẽ từ trên xuống dưới (y từ N-1 về 0), trái qua phải (x từ 0 đến N-1)
    for (let y = N - 1; y >= 0; y--) {
        for (let x = 0; x < N; x++) {
            let bg = "transparent";
            let content = "";
            let border = "1px solid #cbd5e1";
            
            if (x === 0 && y === 0) { bg = "#fef08a"; content = "X"; } // Start
            if (x === N - 1 && y === N - 1) { bg = "#22c55e"; } // End
            
            html += `<div style="width:${cellSize}px; height:${cellSize}px; border:${border}; background:${bg}; display:flex; justify-content:center; align-items:center; font-weight:bold; color:#b45309; position:relative;" id="cell-${x}-${y}">${content}</div>`;
        }
    }
    html += `</div>`;
    
    // Overlay SVG for lines
    html += `<svg id="rb-svg-layer" style="position:absolute; top:10px; left:10px; width:100%; height:100%; pointer-events:none; z-index:10;"></svg>`;
    
    mapContainer.innerHTML = html;

    // Nếu có đường đi, vẽ SVG
    if (horizPath.length > 0 && vertPath.length > 0) {
        setTimeout(() => { draw_path(horizPath, vertPath, cellSize); }, 100);
    }
}

function draw_path(horizPath, vertPath, cellSize) {
    const svg = document.getElementById('rb-svg-layer');
    if (!svg) return;
    
    let svgHtml = '';
    let currX = 0, currY = 0;
    
    // Hàm lấy tâm ô
    const getCenter = (cx, cy) => {
        // Tọa độ Y bị đảo ngược trong grid HTML
        let realY = window.rb_N - 1 - cy; 
        return {
            x: cx * cellSize + cellSize / 2,
            y: realY * cellSize + cellSize / 2
        };
    };

    // Vẽ đường đi ngang (Màu xanh dương)
    for(let move of horizPath) {
        let p1 = getCenter(currX, currY);
        currX += move;
        let p2 = getCenter(currX, currY);
        svgHtml += `<line x1="${p1.x}" y1="${p1.y}" x2="${p2.x}" y2="${p2.y}" stroke="#0284c7" stroke-width="3" marker-end="url(#arrowhead)"/>`;
    }

    // Vẽ đường đi dọc (Màu hồng)
    for(let move of vertPath) {
        let p1 = getCenter(currX, currY);
        currY += move;
        let p2 = getCenter(currX, currY);
        svgHtml += `<line x1="${p1.x}" y1="${p1.y}" x2="${p2.x}" y2="${p2.y}" stroke="#be185d" stroke-width="3" marker-end="url(#arrowhead)"/>`;
    }

    // Định nghĩa mũi tên
    svgHtml += `
        <defs>
            <marker id="arrowhead" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <polygon points="0 0, 6 3, 0 6" fill="#475569" />
            </marker>
        </defs>
    `;
    svg.innerHTML = svgHtml;
}

// Giải phương trình 1 trục
function* solve_axis(D, s1, s2, axisName, mode) {
    if (D === 0) return {x: 0, y: 0, moves: 0};
    if (s1 === 0 && s2 === 0) return null;

    let best = null;

    if (mode === 'sub3') {
        // CÁCH 3: O(N) Loop
        if (s1 > 0) {
            for (let x = 0; x * s1 <= D; x++) {
                let rem = D - x * s1;
                rb_log(`Thử ${axisName}: Chọn x = ${x} (đi ${x*s1}). Còn lại: ${rem}`);
                yield;

                if (s2 > 0 && rem % s2 === 0) {
                    let y = rem / s2;
                    rb_log(`-> ${rem} chia hết cho ${s2}. => y = ${y}. Số lệnh: ${x+y}`, true);
                    if (!best || x + y < best.moves) best = {x: x, y: y, moves: x + y};
                } else if (s2 === 0 && rem === 0) {
                    if (!best || x < best.moves) best = {x: x, y: 0, moves: x};
                } else {
                    rb_log(`-> ${rem} KHÔNG chia hết cho ${s2}. Bỏ qua.`);
                }
            }
        } else if (s2 > 0) {
            if (D % s2 === 0) best = {x: 0, y: D/s2, moves: D/s2};
        }
    } else {
        // CÁCH 2: O(N^2) Loop
        for (let x = 0; x <= D; x++) {
            for (let y = 0; y <= D; y++) {
                if (x * s1 + y * s2 === D) {
                    rb_log(`Tìm thấy: x=${x}, y=${y} -> Tổng: ${x*s1 + y*s2} == ${D}. Số lệnh: ${x+y}`, true);
                    if (!best || x + y < best.moves) best = {x: x, y: y, moves: x + y};
                    yield;
                }
            }
        }
    }

    return best;
}

function* logic_rb_main() {
    // 1. GIẢI TRỤC NGANG
    rb_log(`\n--- PHÂN TÍCH TRỤC NGANG (X) ---`, true);
    yield;
    
    let genHoriz = solve_axis(window.rb_D, window.rb_a, window.rb_b, 'X', window.rb_mode);
    let resHoriz;
    while(true) {
        let v = genHoriz.next();
        if(v.done) { resHoriz = v.value; break; }
        yield;
    }
    
    window.rb_best_horiz = resHoriz;
    if (resHoriz) {
        document.getElementById('rb-res-horiz').innerHTML = `Min Lệnh: ${resHoriz.moves}<br><span style="font-size:0.8rem; font-weight:normal;">(${resHoriz.x} lần a, ${resHoriz.y} lần b)</span>`;
        rb_log(`=> KẾT LUẬN TRỤC X: Cần ${resHoriz.moves} lệnh.`, true);
    } else {
        document.getElementById('rb-res-horiz').innerHTML = `<span style="color:#ef4444;">Vô nghiệm (-1)</span>`;
        rb_log(`=> KẾT LUẬN TRỤC X: Không có cách đi (-1).`, true);
    }

    // Đổi button state
    document.getElementById('btn-rb-step').innerText = "⏭ Tìm Trục Dọc (Y)";
    yield;

    // 2. GIẢI TRỤC DỌC
    rb_log(`\n--- PHÂN TÍCH TRỤC DỌC (Y) ---`, true);
    yield;
    
    let genVert = solve_axis(window.rb_D, window.rb_c, window.rb_d, 'Y', window.rb_mode);
    let resVert;
    while(true) {
        let v = genVert.next();
        if(v.done) { resVert = v.value; break; }
        yield;
    }

    window.rb_best_vert = resVert;
    if (resVert) {
        document.getElementById('rb-res-vert').innerHTML = `Min Lệnh: ${resVert.moves}<br><span style="font-size:0.8rem; font-weight:normal;">(${resVert.x} lần c, ${resVert.y} lần d)</span>`;
        rb_log(`=> KẾT LUẬN TRỤC Y: Cần ${resVert.moves} lệnh.`, true);
    } else {
        document.getElementById('rb-res-vert').innerHTML = `<span style="color:#ef4444;">Vô nghiệm (-1)</span>`;
        rb_log(`=> KẾT LUẬN TRỤC Y: Không có cách đi (-1).`, true);
    }

    // 3. TỔNG KẾT
    document.getElementById('btn-rb-step').innerText = "⏭ Chốt Kết Quả";
    yield;

    if (!resHoriz || !resVert) {
        document.getElementById('rb-res-total').innerText = "-1";
        document.getElementById('rb-res-total').style.color = "#ef4444";
        rb_log(`\n=> KẾT QUẢ CHUNG CUỘC: -1 (Robot không thể tới đích!)`, true);
    } else {
        let total = resHoriz.moves + resVert.moves;
        document.getElementById('rb-res-total').innerText = total;
        rb_log(`\n=> KẾT QUẢ CHUNG CUỘC: ${resHoriz.moves} + ${resVert.moves} = ${total} lệnh.`, true);
        
        // Tạo mảng di chuyển để vẽ Map
        let hPath = [];
        for(let i=0; i<resHoriz.x; i++) hPath.push(window.rb_a);
        for(let i=0; i<resHoriz.y; i++) hPath.push(window.rb_b);
        
        let vPath = [];
        for(let i=0; i<resVert.x; i++) vPath.push(window.rb_c);
        for(let i=0; i<resVert.y; i++) vPath.push(window.rb_d);
        
        rb_render_map(hPath, vPath);
    }

    document.getElementById('btn-rb-step').disabled = true;
    document.getElementById('btn-rb-auto').disabled = true;
    rb_toggle_auto(true);
}

function rb_step() {
    if (window.rb_generator) window.rb_generator.next();
}

function rb_toggle_auto(forceStop = false) {
    const btn = document.getElementById('btn-rb-auto');
    if (window.rb_auto_timer || forceStop) {
        clearInterval(window.rb_auto_timer);
        window.rb_auto_timer = null;
        if (!forceStop) btn.innerHTML = "▶ Tự động";
    } else {
        btn.innerHTML = "⏸ Tạm dừng";
        window.rb_auto_timer = setInterval(() => {
            if(window.rb_generator) {
                let res = window.rb_generator.next();
                if(res.done) rb_toggle_auto(true);
            }
        }, 0); // Tốc độ chạy log
    }
}