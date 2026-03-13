## 🔢 Bài: Đếm số (COUNT - HCM 2020-2021)
<br>
<div class="step-card border-blue">
<div class="step-badge bg-blue">Phân tích đề bài</div>

Cho danh sách $N$ đồ vật với cân nặng $a_i$ và một chiếc thuyền có sức chứa $X$ ($1 \le N, X \le 10^5$).
Có $Q$ truy vấn ($1 \le Q \le 10^5$), mỗi truy vấn là một cặp số $L, R$.

**Yêu cầu:** Đếm xem từ vị trí $L$ đến vị trí $R$, có bao nhiêu đồ vật thỏa mãn 2 điều kiện để đưa lên thuyền:
1. Giá trị dương (khối lượng lớn hơn 0): $a_i > 0$.
2. Nhỏ hơn $X$: $a_i < X$.
   *(Lưu ý: Chỉ nhỏ hơn, không lấy dấu bằng)*.
<div class="important-note">

**📌 Dạng bài:** Tiền xử lý - prefix sum
</div>
</div>

<div class="step-card border-orange">
<div class="step-badge bg-orange">Cách 1: Vét cạn (Dành cho 50% số điểm - Subtask Q = 1)</div>

### 💡 Ý tưởng
Với mỗi truy vấn $(L, R)$, ta dùng một vòng lặp `for` duyệt từ vị trí $L$ đến $R$. Cứ thấy phần tử nào thỏa mãn $0 < a_i < X$ thì tăng biến đếm lên 1.

<pre class="pseudocode">
<span class="kw">LẶP</span> <span class="var">q</span> từ <span class="val">1</span> <span class="kw">ĐẾN</span> <span class="var">Q</span>:
    <span class="kw">NHẬP</span> <span class="var">L</span>, <span class="var">R</span>
    <span class="var">dem</span> = <span class="val">0</span>
    <span class="kw">LẶP</span> <span class="var">i</span> từ <span class="var">L</span> <span class="kw">ĐẾN</span> <span class="var">R</span>:
        <span class="kw">NẾU</span> (<span class="var">a[i]</span> > <span class="val">0</span> <span class="kw">VÀ</span> <span class="var">a[i]</span> < <span class="var">X</span>) <span class="kw">THÌ</span> <span class="var">dem</span> = <span class="var">dem</span> + <span class="val">1</span>
    <span class="kw">XUẤT</span> <span class="var">dem</span>
</pre>
**Đánh giá:** Nếu $Q = 1$, cách này chạy mất $O(N)$ phép tính, rất an toàn. Nhưng nếu $Q = 10^5$ và $N = 10^5$, thuật toán sẽ tốn $O(N \times Q) = 10^{10}$ phép tính, chắc chắn bị TLE (Quá thời gian).
</div>

<div class="step-card border-green">
<div class="step-badge bg-green">Cách 2: Mảng cộng dồn Prefix Sum (100% Điểm)</div>

### 💡 Ý tưởng Tối ưu
Ta sẽ dùng kỹ thuật **Mảng cộng dồn (Prefix Sum)** để trả lời nhanh mọi truy vấn trong thời gian $O(1)$.
- **Bước 1 (Đánh dấu):** Xem đồ vật nào hợp lệ. Nếu $0 < a_i < X$, coi như nó có giá trị $1$. Nếu không hợp lệ, giá trị là $0$.
- **Bước 2 (Cộng dồn):** Tạo mảng $P$ với $P[i]$ là tổng số lượng các đồ vật hợp lệ tính từ đầu mảng đến vị trí $i$. Công thức: $P[i] = P[i-1] + (\text{Giá trị hợp lệ của } a_i)$.
- **Bước 3 (Truy vấn O(1)):** Để đếm số đồ vật hợp lệ trong đoạn từ $L$ đến $R$, ta chỉ cần lấy tổng đến $R$ trừ đi phần dư thừa trước $L$. Công thức: **$\text{Kết quả} = P[R] - P[L - 1]$**.

<pre class="pseudocode">
<span class="kw">NHẬP</span> <span class="var">N</span>, <span class="var">X</span>, <span class="var">Q</span>
<span class="var">P</span> = <span class="fn">Mang</span>(N + 1, <span class="val">0</span>)
<span class="var">P</span>[<span class="val">0</span>] = <span class="val">0</span> <span class="com">// Phần tử rào</span>

<span class="kw">LẶP</span> <span class="var">i</span> từ <span class="val">1</span> <span class="kw">ĐẾN</span> <span class="var">N</span>:
    <span class="kw">NHẬP</span> <span class="var">val</span>
    <span class="var">hople</span> = <span class="val">0</span>
    <span class="kw">NẾU</span> (<span class="var">val</span> > <span class="val">0</span> <span class="kw">VÀ</span> <span class="var">val</span> < <span class="var">X</span>) <span class="kw">THÌ</span> <span class="var">hople</span> = <span class="val">1</span>
    
    <span class="var">P</span>[<span class="var">i</span>] = <span class="var">P</span>[<span class="var">i</span> - <span class="val">1</span>] + <span class="var">hople</span> <span class="com">// Xây dựng mảng cộng dồn</span>

<span class="kw">LẶP</span> <span class="var">q</span> từ <span class="val">1</span> <span class="kw">ĐẾN</span> <span class="var">Q</span>:
    <span class="kw">NHẬP</span> <span class="var">L</span>, <span class="var">R</span>
    <span class="var">Ket_Qua</span> = <span class="var">P</span>[<span class="var">R</span>] - <span class="var">P</span>[<span class="var">L</span> - <span class="val">1</span>]
    <span class="kw">XUẤT</span> <span class="var">Ket_Qua</span>
</pre>
</div>

<div class="step-card border-purple">
    <div class="step-badge bg-purple">Bảng Đánh giá Thuật toán</div>
    
<div class="table-wrapper">
        <table class="algo-table">
            <thead>
                <tr>
                    <th style="width: 25%;">Đặc điểm</th>
                    <th class="th-green" style="width: 75%;">Mảng cộng dồn (Prefix Sum)</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td class="td-label">Độ phức tạp Thời gian</td>
                    <td>$O(N + Q)$. Mất $O(N)$ để duyệt xây dựng mảng $P$, và $O(1)$ cho mỗi truy vấn trong $Q$ truy vấn. Tổng số phép tính $\approx 2 \times 10^5$, chạy chưa tới 0.01 giây. Nhanh gấp hàng nghìn lần so với Vét cạn!</td>
                </tr>
                <tr>
                    <td class="td-label">Độ phức tạp Bộ nhớ</td>
                    <td>$O(N)$ để lưu trữ mảng cộng dồn $P$. Tốn khoảng vài trăm KB, vô cùng an toàn.</td>
                </tr>
            </tbody>
        </table>
    </div>
</div>