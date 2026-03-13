/**
 * FILE MÔ PHỎNG: ĐẾM TỪ TRÙNG LẶP (DEMTUTL - HCM 20-21)
 * Tác giả: Gemini
 */

window.dtl_text = "";
window.dtl_words = [];
window.dtl_generator = null;
window.dtl_auto_timer = null;

function init_hcm2021_demtutl_simulation() {
    const container = document.getElementById('simulation-area');
    if (!container) return;

    container.innerHTML = `
        <div class="step-card border-purple">
            <div class="step-badge bg-purple">Mô phỏng: Quét và Lọc từ trùng lặp (Dạng 1 & Dạng 2)</div>
            
            <div style="display: flex; gap: 15px; margin-bottom: 20px; align-items: flex-start; flex-wrap: wrap;">
                <div style="flex: 2;">
                    <label style="font-size:0.85rem; color:#64748b; font-weight:bold;">Nhập văn bản (có thể dùng dấu câu):</label><br>
                    <textarea id="dtl-input" style="width:100%; height:80px; padding:8px; border-radius:4px; border:1px solid #cbd5e1; font-family:monospace; font-size:1rem;">Con chim xanh xanh
No dau canh chanh</textarea>
                </div>
                <div style="flex: 1; display: flex; flex-direction: column; gap: 10px; margin-top: 18px;">
                    <div style="display: flex; gap: 10px;">
                        <button onclick="dtl_start()" class="toggle-btn" style="background:#0284c7; color:white; flex:1;">🚀 Lọc Từ & Nạp</button>
                    </div>
                    <div style="display: flex; gap: 10px;">
                        <button onclick="dtl_step()" id="btn-dtl-step" class="toggle-btn" style="background:#29c702; color:white; flex:1;" disabled>⏭ Quét tiếp</button>
                        <button onclick="dtl_toggle_auto()" id="btn-dtl-auto" class="toggle-btn" style="background:#8b5cf6; color:white; flex:1;" disabled>▶ Tự động</button>
                    </div>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                <div style="background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px;">
                    <div style="font-size:0.8rem; font-weight:bold; color:#475569; margin-bottom:10px;">MẢNG TỪ TIẾNG ANH (Đã loại bỏ dấu câu)</div>
                    <div id="dtl-word-array" style="display: flex; flex-wrap: wrap; gap: 8px;"></div>
                </div>

                <div style="display: flex; flex-direction: column; gap: 10px;">
                    <div style="background: #f0fdf4; padding: 15px; border-radius: 8px; border: 1px solid #bbf7d0; text-align: center;">
                        <div style="font-size:0.85rem; font-weight:bold; color:#166534; margin-bottom: 5px;">SỐ TỪ TRÙNG LẶP</div>
                        <div id="dtl-res-count" style="color:#15803d; font-size: 2.5rem; font-weight: 900; line-height:1;">0</div>
                    </div>
                    
                    <div style="background: #fffbeb; padding: 15px; border-radius: 8px; border: 1px solid #fde047; flex: 1;">
                        <div style="font-size:0.8rem; font-weight:bold; color:#92400e; margin-bottom:10px;">DANH SÁCH XUẤT RA</div>
                        <div id="dtl-res-list" style="display: flex; flex-wrap: wrap; gap: 6px; font-family:monospace; font-size:1.1rem; color:#b45309;"></div>
                    </div>
                </div>
            </div>

            <div id="dtl-log" style="background: #1e1e1e; color: #d4d4d4; padding: 12px; border-radius: 8px; font-family: monospace; height: 180px; overflow-y: auto; font-size: 0.85rem; line-height: 1.5;">
                > Nhập văn bản và nhấn Lọc Từ...
            </div>
        </div>
    `;
}

function dtl_log(msg, color = "#d4d4d4") {
    const log = document.getElementById('dtl-log');
    log.innerHTML += `<div style="color:${color}">> ${msg}</div>`;
    log.scrollTop = log.scrollHeight;
}

function dtl_start() {
    window.dtl_text = document.getElementById('dtl-input').value.trim();
    if (!window.dtl_text) return;
    
    clearInterval(window.dtl_auto_timer);
    document.getElementById('btn-dtl-auto').innerHTML = "▶ Tự động";
    window.dtl_auto_timer = null;

    // Lọc mảng từ (Tokenization) dùng Regex: Chỉ giữ [a-zA-Z]
    const matches = window.dtl_text.match(/[a-zA-Z]+/g);
    window.dtl_words = matches ? matches : [];

    document.getElementById('dtl-res-count').innerText = "0";
    document.getElementById('dtl-res-list').innerHTML = "";
    document.getElementById('dtl-log').innerHTML = "";
    
    document.getElementById('btn-dtl-step').disabled = false;
    document.getElementById('btn-dtl-auto').disabled = false;
    
    dtl_render_array(-1, -1);
    window.dtl_generator = logic_dtl();
    
    dtl_log(`Bước 1: Tách từ. Đã trích xuất được ${window.dtl_words.length} từ hợp lệ.`, "#38bdf8");
    if(window.dtl_words.length === 0) {
        dtl_log(`Không có từ tiếng Anh nào trong văn bản!`, "#ef4444");
    } else {
        dtl_step();
    }
}

function dtl_render_array(activeIdx, activeIdx2 = -1, state = "testing") {
    const container = document.getElementById('dtl-word-array');
    let html = '';
    
    window.dtl_words.forEach((word, i) => {
        let bg = "#f1f5f9", color = "#475569", border = "1px solid #cbd5e1";
        let transform = "";
        
        if (i === activeIdx || i === activeIdx2) {
            if (state === "testing") {
                bg = "#fef08a"; color = "#b45309"; border = "2px solid #f59e0b"; // Vàng (Đang test)
                transform = "transform: scale(1.05);";
            } else if (state === "match") {
                bg = "#dcfce7"; color = "#15803d"; border = "2px solid #22c55e"; // Xanh (Khớp)
                transform = "transform: scale(1.1); font-weight:bold;";
            } else if (state === "ignore") {
                bg = "#f3f4f6"; color = "#9ca3af"; border = "1px dashed #d1d5db"; // Xám (Loại)
                transform = "opacity: 0.7;";
            }
        }
        
        html += `<div style="padding: 6px 12px; border-radius: 20px; background: ${bg}; color: ${color}; border: ${border}; transition: all 0.3s; ${transform}">${word}</div>`;
    });
    
    container.innerHTML = html;
}

function has_duplicate_chars(word) {
    let lowerWord = word.toLowerCase();
    let seen = new Set();
    for (let char of lowerWord) {
        if (seen.has(char)) return { result: true, duplicateChar: char };
        seen.add(char);
    }
    return { result: false };
}

function* logic_dtl() {
    let words = window.dtl_words;
    let N = words.length;
    let count = 0;
    let results = [];
    let i = 0;

    while (i < N) {
        dtl_log(`\n--------------------------`);
        dtl_log(`Xét từ thứ ${i+1}: <b>"${words[i]}"</b>`);
        
        // 1. Kiểm tra Dạng 2 (2 từ liền kề giống nhau)
        if (i + 1 < N) {
            dtl_render_array(i, i + 1, "testing");
            dtl_log(`Nhìn về trước: So sánh "${words[i].toLowerCase()}" và "${words[i+1].toLowerCase()}"...`);
            yield; 
            
            if (words[i].toLowerCase() === words[i+1].toLowerCase()) {
                dtl_render_array(i, i + 1, "match");
                dtl_log(`=> KHỚP DẠNG 2! Gộp thành: "${words[i]} ${words[i+1]}"`, "#10b981");
                
                count++;
                results.push(`${words[i]} ${words[i+1]}`);
                document.getElementById('dtl-res-count').innerText = count;
                document.getElementById('dtl-res-list').innerHTML += `<div style="background:#fde047; padding:4px 8px; border-radius:4px;">${words[i]} ${words[i+1]}</div>`;
                
                i += 2; // Nhảy cóc
                dtl_log(`Nhảy cóc qua từ thứ ${i} để tránh đếm đúp.`, "#c084fc");
                yield;
                continue;
            } else {
                dtl_log(`Không phải Dạng 2. Chuyển sang kiểm tra Dạng 1...`);
            }
        } else {
            dtl_log(`Từ cuối cùng, không xét Dạng 2. Chuyển sang kiểm tra Dạng 1...`);
        }

        // 2. Kiểm tra Dạng 1 (1 từ có ký tự lặp)
        dtl_render_array(i, -1, "testing");
        let checkType1 = has_duplicate_chars(words[i]);
        
        // Phân tích bóc tách chữ cái ra log cho trực quan
        let breakdown = words[i].toLowerCase().split('').join(' - ');
        dtl_log(`Bóc tách chữ cái: ${breakdown}`, "#94a3b8");
        yield;

        if (checkType1.result) {
            dtl_render_array(i, -1, "match");
            dtl_log(`=> KHỚP DẠNG 1! Ký tự '${checkType1.duplicateChar}' lặp lại.`, "#10b981");
            
            count++;
            results.push(words[i]);
            document.getElementById('dtl-res-count').innerText = count;
            document.getElementById('dtl-res-list').innerHTML += `<div style="background:#bbf7d0; padding:4px 8px; border-radius:4px;">${words[i]}</div>`;
        } else {
            dtl_render_array(i, -1, "ignore");
            dtl_log(`=> BỎ QUA. Không có ký tự nào lặp lại.`, "#ef4444");
        }
        
        i++;
        yield;
    }

    dtl_render_array(-1, -1);
    dtl_log(`\nHOÀN THÀNH TOÀN BỘ VĂN BẢN! Tổng cộng có ${count} từ trùng lặp.`, "#fbbf24");
    
    document.getElementById('btn-dtl-step').disabled = true;
    document.getElementById('btn-dtl-auto').disabled = true;
    dtl_toggle_auto(true);
}

function dtl_step() {
    if (window.dtl_generator) window.dtl_generator.next();
}

function dtl_toggle_auto(forceStop = false) {
    const btn = document.getElementById('btn-dtl-auto');
    if (window.dtl_auto_timer || forceStop) {
        clearInterval(window.dtl_auto_timer);
        window.dtl_auto_timer = null;
        if (!forceStop) btn.innerHTML = "▶ Tự động";
    } else {
        btn.innerHTML = "⏸ Tạm dừng";
        window.dtl_auto_timer = setInterval(() => {
            if(window.dtl_generator) {
                let res = window.dtl_generator.next();
                if(res.done) dtl_toggle_auto(true);
            }
        }, 0); // 1.2s để kịp đọc quá trình phân tích chữ cái
    }
}