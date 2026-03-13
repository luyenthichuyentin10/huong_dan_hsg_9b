## 1️⃣ Bài 1: Số độc lập (SODOCLAP - HCM 2021-2022)
<br>
<div class="step-card border-blue">
<div class="step-badge bg-blue">Phân tích đề bài</div>

**Số độc lập** là số nguyên dương mà các chữ số của nó đôi một khác nhau (không có chữ số nào xuất hiện quá 1 lần). 
Ví dụ: `2019` là số độc lập, nhưng `2022` thì không vì có số `2` lặp lại.

**Yêu cầu:** Cho số nguyên $X$ ($10 < X < 10^9$), tìm số độc lập nhỏ nhất lớn hơn $X$.

**Ví dụ:** Nhập `2022` $\rightarrow$ Kết quả: `2031`.
<div class="important-note">

**📌 Dạng bài:** Xử lý chuỗi - toán
</div>
</div>

<div class="step-card border-orange">
<div class="step-badge bg-orange">Cách 1: Vét cạn cơ bản (Subtask 1: 50% điểm)</div>

### 💡 Ý tưởng
Vì đề bài có 50% test với giới hạn nhỏ $X < 10^4$, ta có thể dùng một vòng lặp `while` đơn giản: Cứ tăng $X$ lên 1 đơn vị, sau đó kiểm tra xem số mới có phải là số độc lập hay không. Nếu phải thì in ra và dừng lại.

<pre class="pseudocode">
<span class="kw">HÀM</span> <span class="fn">Kiem_Tra_Doc_Lap</span>(<span class="var">N</span>):
    <span class="var">S</span> = <span class="fn">Chuyen_Sang_Chuoi</span>(<span class="var">N</span>)
    <span class="var">Danh_Dau</span> = <span class="fn">Mang</span>(10, <span class="kw">SAI</span>)
    
    <span class="kw">LẶP MỖI</span> <span class="var">chu_so</span> <span class="kw">TRONG</span> <span class="var">S</span>:
        <span class="var">so</span> = <span class="var">chu_so</span> - <span class="str">'0'</span>
        <span class="kw">NẾU</span> (<span class="var">Danh_Dau</span>[<span class="var">so</span>] == <span class="kw">ĐÚNG</span>) <span class="kw">THÌ TRẢ VỀ SAI</span>
        <span class="var">Danh_Dau</span>[<span class="var">so</span>] = <span class="kw">ĐÚNG</span>
        
    <span class="kw">TRẢ VỀ ĐÚNG</span>

<span class="com">// CHƯƠNG TRÌNH CHÍNH</span>
<span class="kw">NHẬP</span> <span class="var">X</span>
<span class="var">X</span> = <span class="var">X</span> + <span class="val">1</span>
<span class="kw">LẶP TRONG KHI</span> (<span class="fn">Kiem_Tra_Doc_Lap</span>(<span class="var">X</span>) == <span class="kw">SAI</span>):
    <span class="var">X</span> = <span class="var">X</span> + <span class="val">1</span>
<span class="kw">XUẤT</span> <span class="var">X</span>
</pre>
**Đánh giá:** Rất dễ hiểu. Thực tế, ngay cả với $X < 10^9$, khoảng cách giữa 2 số độc lập không quá lớn, cách này nếu viết khéo (dùng toán bit) vẫn có thể qua được 100% test. Tuy nhiên, nếu gặp số quá lớn, nó có thể hơi chậm.
</div>

<div class="step-card border-green">
<div class="step-badge bg-green">Cách 2: Vét cạn thông minh / Cắt tỉa (Tối ưu 100% Điểm)</div>

### 💡 Ý tưởng Tối ưu (Tua nhanh)
Hãy lấy ví dụ $X = 2022$. 
- Ta bắt đầu với $Y = 2023$. Khi xét từ trái qua phải: `2`, `0`, `2`. Chữ số `2` ở vị trí thứ 3 (index 2) bị trùng!
- Thay vì chỉ cộng thêm 1 để thử `2024`, `2025`... (rất mất thời gian vì chắc chắn phần đầu `202...` vẫn sẽ gây trùng), ta **Tăng thẳng chữ số bị trùng lên 1 đơn vị, và đưa tất cả các chữ số phía sau về 0**.
- Cụ thể: `2023` (trùng ở `2`) $\rightarrow$ Tăng `2` thành `3`, đưa số sau về `0` $\rightarrow$ Nhảy vọt lên `2030`.
- Tiếp tục kiểm tra `2030`: trùng ở `0` (cuối cùng). Tăng `0` thành `1` $\rightarrow$ Nhảy lên `2031`. 
- `2031`: Mọi chữ số khác nhau. Xong!

Kỹ thuật này giúp ta "nhảy cóc" qua hàng ngàn số vô nghĩa, biến thuật toán tiệm cận về thời gian $O(1)$.

<pre class="pseudocode">
<span class="kw">NHẬP</span> <span class="var">X</span>
<span class="var">N</span> = <span class="var">X</span> + <span class="val">1</span>

<span class="kw">LẶP VÔ HẠN</span>:
    <span class="var">S</span> = <span class="fn">Chuyen_Sang_Chuoi</span>(<span class="var">N</span>)
    <span class="var">Trung_Lap_Tai</span> = -<span class="val">1</span>
    <span class="var">Danh_Dau</span> = <span class="fn">Mang</span>(10, <span class="kw">SAI</span>)
    
    <span class="com">// Tìm chữ số trùng lặp đầu tiên từ trái qua phải</span>
    <span class="kw">LẶP</span> <span class="var">i</span> từ <span class="val">0</span> <span class="kw">ĐẾN</span> <span class="fn">Kich_Thuoc</span>(<span class="var">S</span>) - <span class="val">1</span>:
        <span class="var">so</span> = <span class="var">S</span>[<span class="var">i</span>] - <span class="str">'0'</span>
        <span class="kw">NẾU</span> (<span class="var">Danh_Dau</span>[<span class="var">so</span>] == <span class="kw">ĐÚNG</span>) <span class="kw">THÌ</span>:
            <span class="var">Trung_Lap_Tai</span> = <span class="var">i</span>
            <span class="kw">THOÁT_LẶP</span>
        <span class="var">Danh_Dau</span>[<span class="var">so</span>] = <span class="kw">ĐÚNG</span>
        
    <span class="com">// Nếu không có trùng lặp, đây chính là đáp án!</span>
    <span class="kw">NẾU</span> (<span class="var">Trung_Lap_Tai</span> == -<span class="val">1</span>) <span class="kw">THÌ</span>:
        <span class="kw">XUẤT</span> <span class="var">N</span>
        <span class="kw">KẾT_THÚC CHƯƠNG TRÌNH</span>
        
    <span class="com">// Kỹ thuật Tua nhanh (Nhảy cóc)</span>
    <span class="com">// 1. Cắt lấy phần đầu từ 0 đến vị trí trùng lặp</span>
    <span class="var">Phan_Dau</span> = <span class="fn">Lay_Chuoi_Con</span>(<span class="var">S</span>, <span class="val">0</span>, <span class="var">Trung_Lap_Tai</span>)
    
    <span class="com">// 2. Tăng giá trị phần đầu lên 1</span>
    <span class="var">Gia_Tri_Moi</span> = <span class="fn">Chuyen_Sang_So</span>(<span class="var">Phan_Dau</span>) + <span class="val">1</span>
    
    <span class="com">// 3. Ghép thêm các số 0 vào đuôi cho đủ chiều dài ban đầu</span>
    <span class="var">So_Luong_Khong</span> = <span class="fn">Kich_Thuoc</span>(<span class="var">S</span>) - <span class="val">1</span> - <span class="var">Trung_Lap_Tai</span>
    <span class="var">S_Moi</span> = <span class="fn">Chuyen_Sang_Chuoi</span>(<span class="var">Gia_Tri_Moi</span>) + <span class="fn">Tao_Chuoi_0</span>(<span class="var">So_Luong_Khong</span>)
    
    <span class="var">N</span> = <span class="fn">Chuyen_Sang_So</span>(<span class="var">S_Moi</span>)
</pre>
</div>

<div class="step-card border-purple">
    <div class="step-badge bg-purple">Bảng Đánh giá Thuật toán</div>
    
<div class="table-wrapper">
        <table class="algo-table">
            <thead>
                <tr>
                    <th style="width: 25%;">Đặc điểm</th>
                    <th class="th-green" style="width: 75%;">Vét cạn Nhảy cóc (Smart Brute-force)</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td class="td-label">Độ phức tạp Thời gian</td>
                    <td>Rất nhỏ, xấp xỉ $O(\text{Số chữ số})$. Mỗi lần phát hiện trùng lặp, thuật toán sẽ triệt tiêu ngay nhánh sai và nhảy thẳng đến con số tiềm năng tiếp theo. Mượt mà vượt qua mọi test $10^9$.</td>
                </tr>
                <tr>
                    <td class="td-label">Sự thanh lịch</td>
                    <td>Không cần viết code nối chuỗi hay xử lý "Nhớ" (Carry) phức tạp của phép cộng. Chỉ cần chặt chuỗi thành số, cộng 1, rồi nối thêm số 0 vào cuối.</td>
                </tr>
            </tbody>
        </table>
    </div>
</div>