/**
 * FILE MÔ PHỎNG: BÀI LAPTOP (HCM 2011-2012)
 * Tên hàm: init_hcm1112_laptop_simulation
 */

window.laptop_data = [];
window.laptop_valid = [];
window.laptop_step = 0; // 0: init, 1: filtering, 2: find min
window.laptop_curr_i = 0;
window.laptop_curr_j = 0;

function init_hcm1112_laptop_simulation() {
    const container = document.getElementById('simulation-area');
    if (!container) return;

    container.innerHTML = `
        <div class="step-card border-purple">
            <div class="step-badge bg-purple">Mô phỏng chọn Laptop</div>
            
            <div style="margin-bottom: 20px;">
                <p><b>Dữ liệu mẫu:</b> (N=5)</p>
                <div id="laptop-table-container"></div>
            </div>

            <div style="display: flex; gap: 10px; margin-bottom: 20px;">
                <button onclick="laptop_init()" class="toggle-btn" style="background:#0284c7; color:white;">🚀 Khởi tạo</button>
                <button onclick="laptop_nextStep()" id="btn-step-laptop" class="toggle-btn" style="background:#29c702; color:white;" disabled>⏭ Bước tiếp theo</button>
            </div>

            <div class="sim-layout" style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                <div style="background: #f8fafc; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0;">
                    <div style="font-weight: bold; margin-bottom: 10px; color: #0c4a6e;">Trạng thái:</div>
                    <div id="laptop-status" style="font-size: 0.95rem; line-height: 1.6;">
                        Nhấn Khởi tạo để bắt đầu.
                    </div>
                </div>
                
                <div id="laptop-log" style="background: #1e1e1e; color: #d4d4d4; padding: 15px; border-radius: 8px; font-family: 'Consolas', monospace; height: 250px; overflow-y: auto; font-size: 0.85rem;">
                    > Chờ lệnh...
                </div>
            </div>
        </div>
    `;
    laptop_init();
}

function laptop_log(msg, color = "#d4d4d4") {
    const logArea = document.getElementById('laptop-log');
    if (logArea) {
        logArea.innerHTML += `<div style="color: ${color}">> ${msg}</div>`;
        logArea.scrollTop = logArea.scrollHeight;
    }
}

function laptop_init() {
    window.laptop_data = [
        {id: 1, cpu: 2100, ram: 512, hdd: 150, price: 200},
        {id: 2, cpu: 2000, ram: 2048, hdd: 240, price: 350},
        {id: 3, cpu: 2300, ram: 1024, hdd: 200, price: 320},
        {id: 4, cpu: 2500, ram: 2048, hdd: 80, price: 300},
        {id: 5, cpu: 2000, ram: 512, hdd: 180, price: 150}
    ];
    window.laptop_valid = [true, true, true, true, true];
    window.laptop_step = 1;
    window.laptop_curr_i = 0;
    window.laptop_curr_j = 0;

    laptop_renderTable();
    document.getElementById('btn-step-laptop').disabled = false;
    document.getElementById('laptop-status').innerHTML = "Đang ở bước 1: Loại bỏ laptop bị áp đảo cả 3 thông số.";
    document.getElementById('laptop-log').innerHTML = "";
    laptop_log("Bắt đầu so sánh các cặp laptop...", "#f59e0b");
}

function laptop_renderTable() {
    let html = `
        <table class="garden-table" style="width:100%; text-align:center; border-collapse:collapse;">
            <thead>
                <tr style="background:#f1f5f9;">
                    <th>ID</th><th>CPU</th><th>RAM</th><th>HDD</th><th>Giá</th><th>Trạng thái</th>
                </tr>
            </thead>
            <tbody>
    `;
    window.laptop_data.forEach((l, idx) => {
        let rowStyle = "";
        if (window.laptop_step === 1 && idx === window.laptop_curr_i) rowStyle = "background:#fef08a;";
        if (window.laptop_step === 1 && idx === window.laptop_curr_j && idx !== window.laptop_curr_i) rowStyle = "background:#e0f2fe;";
        if (!window.laptop_valid[idx]) rowStyle = "background:#fee2e2; color:#941c1c; text-decoration:line-through;";

        html += `
            <tr style="${rowStyle} border-bottom:1px solid #e2e8f0;">
                <td>${l.id}</td><td>${l.cpu}</td><td>${l.ram}</td><td>${l.hdd}</td><td>${l.price}</td>
                <td>${window.laptop_valid[idx] ? "Hợp lệ" : "Bị loại"}</td>
            </tr>
        `;
    });
    html += "</tbody></table>";
    document.getElementById('laptop-table-container').innerHTML = html;
}

function laptop_nextStep() {
    if (window.laptop_step === 1) {
        // Vòng lặp i và j
        if (window.laptop_curr_i < window.laptop_data.length) {
            if (!window.laptop_valid[window.laptop_curr_i]) {
                window.laptop_curr_i++;
                window.laptop_curr_j = 0;
                laptop_nextStep();
                return;
            }

            if (window.laptop_curr_j < window.laptop_data.length) {
                if (window.laptop_curr_i !== window.laptop_curr_j) {
                    let i = window.laptop_curr_i;
                    let j = window.laptop_curr_j;
                    let li = window.laptop_data[i];
                    let lj = window.laptop_data[j];

                    if (li.cpu < lj.cpu && li.ram < lj.ram && li.hdd < lj.hdd) {
                        window.laptop_valid[i] = false;
                        laptop_log(`Laptop ${li.id} bị loại bởi Laptop ${lj.id} (Tất cả thông số thấp hơn)`, "#ef4444");
                    }
                }
                window.laptop_curr_j++;
            } else {
                window.laptop_curr_i++;
                window.laptop_curr_j = 0;
            }
            laptop_renderTable();
        } else {
            window.laptop_step = 2;
            document.getElementById('laptop-status').innerHTML = "Đang ở bước 2: Tìm laptop rẻ nhất trong danh sách hợp lệ.";
            laptop_log("Hoàn tất lọc. Bắt đầu tìm giá rẻ nhất...", "#38bdf8");
            laptop_renderTable();
        }
    } else if (window.laptop_step === 2) {
        let minPrice = 9999;
        let bestId = -1;
        window.laptop_data.forEach((l, idx) => {
            if (window.laptop_valid[idx] && l.price < minPrice) {
                minPrice = l.price;
                bestId = l.id;
            }
        });
        laptop_log(`Trong các máy hợp lệ, máy ${bestId} có giá rẻ nhất (${minPrice})`, "#10b981");
        document.getElementById('laptop-status').innerHTML = `<b style="color:#10b981;">Kết quả cuối cùng: Laptop số ${bestId}</b>`;
        document.getElementById('btn-step-laptop').disabled = true;
    }
}