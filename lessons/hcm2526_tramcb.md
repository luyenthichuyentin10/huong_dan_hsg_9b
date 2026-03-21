## 📡 Bài 1: Trạm cảm biến (TRAMCB - Đề tham khảo 2025-2026)
<br>
<div class="step-card border-blue">
<div class="step-badge bg-blue">Phân tích Toán học</div>

**Giải mã yêu cầu:**
- Công ty có $N$ cảm biến độ ẩm và $M$ cảm biến nhiệt độ. Cần chia vào các trạm.
- Mỗi trạm có số lượng cảm biến mỗi loại bằng nhau và phải dùng hết toàn bộ cảm biến.
$\Rightarrow$ Nếu gọi $K$ là số lượng trạm, thì $N$ phải chia hết cho $K$, và $M$ cũng phải chia hết cho $K$. Vậy $K$ là **Ước chung** của $N$ và $M$.
- **Yêu cầu:** Tìm số lượng trạm nhiều nhất ($K$ lớn nhất).
$\Rightarrow$ Bài toán thực chất là: Tìm **Ước chung lớn nhất (GCD)** của $N$ và $M$.

**⚠️ Cảnh báo Kiểu dữ liệu:**
Đề cho $N, M \le 10^{18}$. Số này vượt quá giới hạn của kiểu `int` thông thường ($2 \times 10^9$). Bắt buộc phải khai báo biến kiểu `long long` trong C++ để không bị tràn số.
<div class="important-note">

**📌 Dạng bài:** Toán - ước chung lớn nhất
</div>
</div>

<div class="step-card border-orange">
<div class="step-badge bg-orange">Cách 1: Vét cạn (Subtask 1: N, M < 10^7)</div>

### 💡 Ý tưởng Subtask 1 (40% Điểm)
Với giới hạn $10^7$, ta có thể dùng vòng lặp chạy ngược từ $\min(N, M)$ lùi về $1$. Số đầu tiên mà cả $N$ và $M$ cùng chia hết chính là Ước chung lớn nhất.

<pre class="pseudocode">
<span class="kw">NHẬP</span> <span class="var">N</span>, <span class="var">M</span> <span class="com">// Kiểu long long</span>

<span class="var">Min_Val</span> = <span class="fn">MIN</span>(<span class="var">N</span>, <span class="var">M</span>)
<span class="var">K</span> = <span class="val">1</span>

<span class="kw">LẶP</span> <span class="var">i</span> từ <span class="var">Min_Val</span> <span class="kw">GIẢM VỀ</span> <span class="val">1</span>:
    <span class="kw">NẾU</span> (<span class="var">N</span> % <span class="var">i</span> == <span class="val">0</span> <span class="kw">VÀ</span> <span class="var">M</span> % <span class="var">i</span> == <span class="val">0</span>) <span class="kw">THÌ</span>:
        <span class="var">K</span> = <span class="var">i</span>
        <span class="kw">THOÁT LẶP</span>

<span class="kw">XUẤT</span> <span class="var">K</span>
<span class="kw">XUẤT</span> <span class="var">N</span> / <span class="var">K</span>, <span class="var">M</span> / <span class="var">K</span>
</pre>
**Đánh giá:** Thời gian chạy $O(\min(N, M))$. Với $10^7$, máy tính chạy mất khoảng 0.05 giây, ăn trọn 40% điểm. Nhưng nếu đem chạy test $10^{18}$, máy tính sẽ mất... hàng trăm năm để chạy xong vòng lặp này (Time Limit Exceeded).
</div>

<div class="step-card border-green">
<div class="step-badge bg-green">Cách 2: Thuật toán Euclid (Subtask 2 - 100% Điểm)</div>

### 💡 Ý tưởng Tối ưu (Thuật toán Euclid O(log N))
Hơn 2000 năm trước, nhà toán học Euclid đã phát minh ra thuật toán tìm GCD cực kỳ nhanh dựa trên tính chất: **GCD của hai số $A$ và $B$ ($A > B$) cũng chính là GCD của $B$ và phần dư của $A$ chia cho $B$ ($A \pmod B$)**.

Thay vì trừ dần, phép chia lấy dư (`%`) làm cho các con số giảm đi cực kỳ nhanh chóng. Quá trình dừng lại khi phần dư bằng 0.

<pre class="pseudocode">
<span class="com">// Hàm đệ quy tìm GCD</span>
<span class="kw">HÀM</span> <span class="fn">GCD</span>(<span class="var">a</span>, <span class="var">b</span>):
    <span class="kw">NẾU</span> (<span class="var">b</span> == <span class="val">0</span>) <span class="kw">THÌ TRẢ VỀ</span> <span class="var">a</span>
    <span class="kw">TRẢ VỀ</span> <span class="fn">GCD</span>(<span class="var">b</span>, <span class="var">a</span> % <span class="var">b</span>)

<span class="com">// CHƯƠNG TRÌNH CHÍNH</span>
<span class="kw">NHẬP</span> <span class="var">N</span>, <span class="var">M</span> <span class="com">// Kiểu long long</span>

<span class="var">K</span> = <span class="fn">GCD</span>(<span class="var">N</span>, <span class="var">M</span>)

<span class="kw">XUẤT</span> <span class="var">K</span>
<span class="kw">XUẤT</span> <span class="var">N</span> / <span class="var">K</span>, <span class="var">M</span> / <span class="var">K</span>
</pre>
*(Mẹo: Trong C++, thư viện `<algorithm>` hoặc `<numeric>` đã hỗ trợ sẵn hàm `std::gcd(a, b)` nên học sinh thậm chí không cần tự viết hàm này).*

**Đánh giá:** Độ phức tạp là $O(\log(\min(N, M)))$. Với $N, M = 10^{18}$, thuật toán này chỉ cần không quá 80 phép tính (khoảng $0.000001$ giây) là ra kết quả!
</div>

<div class="step-card border-purple">
    <div class="step-badge bg-purple">Tổng kết: Đánh giá Thuật toán</div>
    
<div class="table-wrapper">
        <table class="algo-table" style="font-size: 0.9rem;">
            <thead>
                <tr>
                    <th style="width: 25%;">Tiêu chí</th>
                    <th class="th-orange" style="width: 35%;">Vét cạn (Vòng lặp ngược)</th>
                    <th class="th-green" style="width: 40%;">Thuật toán Euclid</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td class="td-label">Độ phức tạp Thời gian</td>
                    <td>$O(\min(N, M))$</td>
                    <td><b>$O(\log(\min(N, M)))$</b></td>
                </tr>
                <tr>
                    <td class="td-label">Kết quả với $10^{18}$</td>
                    <td>Tràn thời gian (TLE) ngay lập tức.</td>
                    <td>Mượt mà (AC 100% điểm).</td>
                </tr>
                <tr>
                    <td class="td-label">Bản chất</td>
                    <td>Thử từng số một xem có thỏa mãn không.</td>
                    <td>Loại bỏ các phần bội số chung một cách triệt để thông qua phép chia lấy dư.</td>
                </tr>
            </tbody>
        </table>
    </div>
</div>