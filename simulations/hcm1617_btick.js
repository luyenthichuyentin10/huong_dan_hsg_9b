/**
 * FILE MÔ PHỎNG: MUA VÉ (BTICK - HCM 16-17)
 * Tác giả: Gemini
 */

window.btick_n = 0n;
window.btick_k = 0n;
window.btick_p1 = 0n;
window.btick_p2 = 0n;
window.btick_generator = null;

function init_hcm1617_btick_simulation() {
    const container = document.getElementById('simulation-area');
    if (!container) return;

    container.innerHTML = `
        <div class="step-card border-purple">
            <div class="step-badge bg-purple">Mô phỏng Phương án Mua vé (BTICK)</div>
            
            <div style="display: flex; gap: 15px; margin-bottom: 20px; align-items: center; flex-wrap: wrap;">
                <div>n (Số vé): <input type="text" id="btick-n" value="12" style="width:70px; padding:4px;"></div>
                <div>k (Tập vé): <input type="text" id="btick-k" value="10" style="width:70px; padding:4px;"></div>
                <div>p1 (Giá lẻ): <input type="text" id="btick-p1" value="17" style="width:70px; padding:4px;"></div>
                <div>p2 (Giá tập): <input type="text" id="btick-p2" value="120" style="width:70px; padding:4px;"></div>
                <button onclick="btick_start()" class="toggle-btn" style="background:#0284c7; color:white;">🚀 Bắt đầu</button>
                <button onclick="btick_step()" id="btn-btick-step" class="toggle-btn" style="background:#29c702; color:white;" disabled>⏭ Bước tiếp theo</button>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px; margin-bottom: 20px;">
                <div id="strat-1" style="background: white; padding: 15px; border-radius: 8px; border: 2px solid #e2e8f0; text-align: center; opacity: 0.5;">
                    <div style="font-weight:bold; color:#475569; margin-bottom:10px;">Chiến lược 1</div>
                    <div style="font-size:0.9rem; margin-bottom:10px;">Chỉ mua vé lẻ</div>
                    <div id="strat-1-math" style="font-family:monospace; min-height:40px;">-</div>
                    <div id="strat-1-cost" style="font-size:1.5rem; font-weight:bold; color:#0f172a; margin-top:10px;">0</div>
                </div>

                <div id="strat-2" style="background: white; padding: 15px; border-radius: 8px; border: 2px solid #e2e8f0; text-align: center; opacity: 0.5;">
                    <div style="font-weight:bold; color:#475569; margin-bottom:10px;">Chiến lược 2</div>
                    <div style="font-size:0.9rem; margin-bottom:10px;">Ưu tiên Tập + Lẻ bù dư</div>
                    <div id="strat-2-math" style="font-family:monospace; min-height:40px;">-</div>
                    <div id="strat-2-cost" style="font-size:1.5rem; font-weight:bold; color:#0f172a; margin-top:10px;">0</div>
                </div>

                <div id="strat-3" style="background: white; padding: 15px; border-radius: 8px; border: 2px solid #e2e8f0; text-align: center; opacity: 0.5;">
                    <div style="font-weight:bold; color:#475569; margin-bottom:10px;">Chiến lược 3</div>
                    <div style="font-size:0.9rem; margin-bottom:10px;">Ưu tiên Tập + Tập bù dư</div>
                    <div id="strat-3-math" style="font-family:monospace; min-height:40px;">-</div>
                    <div id="strat-3-cost" style="font-size:1.5rem; font-weight:bold; color:#0f172a; margin-top:10px;">0</div>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: 1.5fr 1fr; gap: 15px;">
                <div id="btick-log" style="background: #1e1e1e; color: #d4d4d4; padding: 12px; border-radius: 8px; font-family: monospace; height: 160px; overflow-y: auto; font-size: 0.85rem; line-height: 1.5;">
                    > Nhập thông số và nhấn Bắt đầu...
                </div>
                <div style="background: #f0fdf4; padding: 12px; border-radius: 8px; border: 1px solid #bbf7d0; text-align: center; display: flex; flex-direction: column; justify-content: center;">
                    <div style="font-size:0.85rem; font-weight:bold; color:#166534;">CHI PHÍ THẤP NHẤT</div>
                    <div id="btick-res" style="color:#15803d; font-size: 2.5rem; font-weight: 900;">0</div>
                </div>
            </div>
        </div>
    `;
}

function btick_log(msg, color = "#d4d4d4") {
    const log = document.getElementById('btick-log');
    log.innerHTML += `<div style="color:${color}">> ${msg}</div>`;
    log.scrollTop = log.scrollHeight;
}

function reset_strat_ui() {
    for(let i=1; i<=3; i++) {
        document.getElementById(`strat-${i}`).style.opacity = "0.5";
        document.getElementById(`strat-${i}`).style.borderColor = "#e2e8f0";
        document.getElementById(`strat-${i}`).style.backgroundColor = "white";
        document.getElementById(`strat-${i}-math`).innerHTML = "-";
        document.getElementById(`strat-${i}-cost`).innerText = "0";
    }
}

function highlight_strat(id, isWinner = false) {
    const el = document.getElementById(`strat-${id}`);
    el.style.opacity = "1";
    if (isWinner) {
        el.style.borderColor = "#22c55e";
        el.style.backgroundColor = "#f0fdf4";
        el.style.boxShadow = "0 4px 6px -1px rgba(34, 197, 94, 0.2)";
    } else {
        el.style.borderColor = "#cbd5e1";
    }
}

function btick_start() {
    try {
        window.btick_n = BigInt(document.getElementById('btick-n').value.trim());
        window.btick_k = BigInt(document.getElementById('btick-k').value.trim());
        window.btick_p1 = BigInt(document.getElementById('btick-p1').value.trim());
        window.btick_p2 = BigInt(document.getElementById('btick-p2').value.trim());
    } catch(e) {
        alert("Dữ liệu không hợp lệ. Vui lòng nhập số nguyên.");
        return;
    }

    reset_strat_ui();
    document.getElementById('btick-log').innerHTML = "";
    document.getElementById('btick-res').innerText = "0";
    document.getElementById('btn-btick-step').disabled = false;

    window.btick_generator = logic_btick();
    btick_step();
}

function* logic_btick() {
    let n = window.btick_n;
    let k = window.btick_k;
    let p1 = window.btick_p1;
    let p2 = window.btick_p2;

    // Phân tích giá trị
    let cost_k_singles = k * p1;
    btick_log(`Phân tích: Mua ${k} vé lẻ tốn ${cost_k_singles}, trong khi 1 tập ${k} vé tốn ${p2}.`);
    yield;

    if (cost_k_singles <= p2) {
        btick_log(`=> Mua lẻ rẻ hơn hoặc bằng mua tập. Áp dụng Chiến lược 1.`, "#f59e0b");
        let total = n * p1;
        highlight_strat(1, true);
        document.getElementById('strat-1-math').innerHTML = `${n} vé × ${p1}`;
        document.getElementById('strat-1-cost').innerText = total;
        document.getElementById('btick-res').innerText = total;
        btick_log(`KẾT QUẢ: Chi phí thấp nhất là ${total}`, "#10b981");
        document.getElementById('btn-btick-step').disabled = true;
        return;
    }

    btick_log(`=> Mua tập rẻ hơn! Ưu tiên mua tập.`, "#38bdf8");
    yield;

    // Tính toán số tập
    let bundles = n / k;
    let rem = n % k;
    let cost_bundles = bundles * p2;
    
    btick_log(`Có thể mua tối đa ${bundles} tập vé. Chi phí: ${bundles} × ${p2} = ${cost_bundles}.`);
    btick_log(`Số vé còn thiếu: ${rem} vé.`);
    yield;

    // Chiến lược 2: Tập + Lẻ
    let cost_rem_single = rem * p1;
    let total_s2 = cost_bundles + cost_rem_single;
    highlight_strat(2);
    document.getElementById('strat-2-math').innerHTML = `(${bundles} × ${p2})<br>+ (${rem} × ${p1})`;
    document.getElementById('strat-2-cost').innerText = total_s2;
    btick_log(`[Chiến lược 2] Bù phần thiếu bằng vé lẻ: Tốn thêm ${cost_rem_single} -> Tổng = ${total_s2}`);
    yield;

    // Chiến lược 3: Tập + Tập
    let total_s3 = cost_bundles + p2;
    highlight_strat(3);
    document.getElementById('strat-3-math').innerHTML = `(${bundles} × ${p2})<br>+ (1 × ${p2})`;
    document.getElementById('strat-3-cost').innerText = total_s3;
    btick_log(`[Chiến lược 3] Bù phần thiếu bằng 1 tập vé (mua dư): Tốn thêm ${p2} -> Tổng = ${total_s3}`);
    yield;

    // So sánh
    if (total_s2 <= total_s3) {
        highlight_strat(2, true);
        document.getElementById('btick-res').innerText = total_s2;
        btick_log(`So sánh phần bù: Mua lẻ (${cost_rem_single}) RẺ HƠN mua thêm 1 tập (${p2}).`, "#10b981");
        btick_log(`KẾT QUẢ: Chọn Chiến lược 2. Chi phí = ${total_s2}`, "#10b981");
    } else {
        highlight_strat(3, true);
        document.getElementById('btick-res').innerText = total_s3;
        btick_log(`So sánh phần bù: Mua thêm 1 tập (${p2}) RẺ HƠN mua lẻ (${cost_rem_single}).`, "#10b981");
        btick_log(`KẾT QUẢ: Chọn Chiến lược 3. Chi phí = ${total_s3}`, "#10b981");
    }

    document.getElementById('btn-btick-step').disabled = true;
}

function btick_step() {
    if (window.btick_generator) {
        window.btick_generator.next();
    }
}