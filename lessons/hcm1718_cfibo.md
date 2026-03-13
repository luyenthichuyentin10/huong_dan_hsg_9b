## 🔢 Bài: Số lượng số Fibonacci (CFIBO - HCM 2017-2018)
<br>
<div class="step-card border-blue">
<div class="step-badge bg-blue">Phân tích đề bài</div>

Cho hai số nguyên dương $A$ và $B$ ($0 \le A \le B \le 10^{18}$).
Dãy số Fibonacci được định nghĩa: 
- $f(0) = 0$
- $f(1) = 1, f(2) = 1$
- $f(n) = f(n-1) + f(n-2)$ với $n > 2$.

**Yêu cầu:** Đếm xem có bao nhiêu số Fibonacci mang giá trị nằm trong đoạn $[A, B]$.

**Ví dụ:** $A = 2, B = 10$.
Các số Fibonacci đầu tiên: 0, 1, 1, 2, 3, 5, 8, 13, 21...
Các số nằm trong đoạn $[2, 10]$ là: 2, 3, 5, 8.
$\Rightarrow$ Có 4 số thỏa mãn, đáp án là **4**.

⚠️ **Lưu ý quan trọng:** Đề bài hỏi "số lượng số Fibonacci có giá trị trong đoạn", tức là sẽ tính luôn các giá trị $F[i] = A$ và $F[i] = B$
<div class="important-note">

**📌 Dạng bài:** Số học, tiền xử lý - tìm kiếm nhị phân  
</div>
</div>

<div class="step-card border-orange">
<div class="step-badge bg-orange">Cách 1: Sinh trực tiếp và đếm (O(K))</div>

### 💡 Ý tưởng
Dãy Fibonacci tăng rất nhanh. Số Fibonacci thứ 90 đã vượt quá $10^{18}$. 
Vì vậy, thay vì tìm một công thức phức tạp, ta chỉ cần **dùng vòng lặp sinh lần lượt từng số Fibonacci** từ nhỏ đến lớn. 
- Nếu số sinh ra $< A$: Bỏ qua, sinh tiếp.
- Nếu $A \le$ số sinh ra $\le B$: Tăng biến đếm.
- Nếu số sinh ra $> B$: Dừng vòng lặp ngay lập tức vì các số sau chắc chắn sẽ còn lớn hơn nữa.

**Mã giả thuật toán:**
<pre class="pseudocode">
<span class="kw">NHẬP</span> <span class="var">A</span>, <span class="var">B</span>;
<span class="var">f1</span> = <span class="val">0</span>; <span class="var">f2</span> = <span class="val">1</span>;
<span class="var">dem</span> = <span class="val">0</span>;

<span class="kw">NẾU</span> (<span class="var">A</span> == <span class="val">0</span>) <span class="kw">THÌ</span> <span class="var">dem</span> = <span class="val">1</span>; <span class="com">// Xét riêng số f(0) = 0</span>
<span class="kw">NẾU</span> (<span class="var">A</span> <= <span class="val">1</span> <span class="kw">VÀ</span> <span class="val">1</span> <= <span class="var">B</span>) <span class="kw">THÌ</span> <span class="var">dem</span> = <span class="var">dem</span> + <span class="val">1</span>; <span class="com">// Xét giá trị 1 (chỉ đếm 1 lần)</span>

<span class="kw">LẶP TRONG KHI</span> (<span class="kw">ĐÚNG</span>):
    <span class="var">fn</span> = <span class="var">f1</span> + <span class="var">f2</span>;
    <span class="kw">NẾU</span> (<span class="var">fn</span> > <span class="var">B</span>) <span class="kw">THÌ</span> <span class="kw">THOÁT_LẶP</span>;
    <span class="kw">NẾU</span> (<span class="var">fn</span> >= <span class="var">A</span>) <span class="kw">THÌ</span> <span class="var">dem</span> = <span class="var">dem</span> + <span class="val">1</span>;
    
    <span class="var">f1</span> = <span class="var">f2</span>;
    <span class="var">f2</span> = <span class="var">fn</span>;

<span class="kw">XUẤT</span> <span class="var">dem</span>;
</pre>
</div>

<div class="step-card border-green">
<div class="step-badge bg-green">Cách 2: Tiền xử lý + Tìm kiếm nhị phân</div>

### 💡 Ý tưởng (Mở rộng)
Nếu bài toán cho $Q$ truy vấn (ví dụ $10^5$ cặp $A, B$ khác nhau), việc sinh lại dãy Fibonacci cho mỗi câu hỏi sẽ bị chậm.
Khi đó, ta có thể:
1. **Tiền xử lý (Precompute):** Khởi tạo một mảng toàn cục chứa sẵn $\approx 90$ số Fibonacci đầu tiên.
2. **Tìm kiếm nhị phân (Binary Search):** Với mỗi cặp $(A, B)$, ta dùng hàm `lower_bound` để tìm vị trí của $A$, và `upper_bound` để tìm vị trí của $B$. Số lượng số thỏa mãn chính là hiệu của 2 vị trí này.

<pre class="pseudocode">
<span class="com">// TÌM VỊ TRÍ ĐẦU TIÊN CÓ GIÁ TRỊ ≥ X</span>
<span class="kw">HÀM</span> <span class="fn">Lower_Bound</span>(<span class="var">X</span>):
    <span class="var">l</span> = <span class="val">0</span>; <span class="var">r</span> = <span class="fn">Kich_Thuoc</span>(<span class="var">F</span>) - <span class="val">1</span>;
    <span class="var">res</span> = <span class="fn">Kich_Thuoc</span>(<span class="var">F</span>);
    
    <span class="kw">LẶP TRONG KHI</span> (<span class="var">l</span> ≤ <span class="var">r</span>):
        <span class="var">mid</span> = (<span class="var">l</span> + <span class="var">r</span>) / <span class="val">2</span>;
        <span class="kw">NẾU</span> (<span class="var">F[mid]</span> ≥ <span class="var">X</span>) <span class="kw">THÌ</span>:
            <span class="var">res</span> = <span class="var">mid</span>;
            <span class="var">r</span> = <span class="var">mid</span> - <span class="val">1</span>;
        <span class="kw">NGƯỢC LẠI</span>:
            <span class="var">l</span> = <span class="var">mid</span> + <span class="val">1</span>;
    <span class="kw">TRẢ VỀ</span> <span class="var">res</span>;

<span class="com">// TÌM VỊ TRÍ ĐẦU TIÊN CÓ GIÁ TRỊ > X</span>
<span class="kw">HÀM</span> <span class="fn">Upper_Bound</span>(<span class="var">X</span>):
    <span class="var">l</span> = <span class="val">0</span>; <span class="var">r</span> = <span class="fn">Kich_Thuoc</span>(<span class="var">F</span>) - <span class="val">1</span>;
    <span class="var">res</span> = <span class="fn">Kich_Thuoc</span>(<span class="var">F</span>);
    
    <span class="kw">LẶP TRONG KHI</span> (<span class="var">l</span> ≤ <span class="var">r</span>):
        <span class="var">mid</span> = (<span class="var">l</span> + <span class="var">r</span>) / <span class="val">2</span>;
        <span class="kw">NẾU</span> (<span class="var">F[mid]</span> > <span class="var">X</span>) <span class="kw">THÌ</span>:
            <span class="var">res</span> = <span class="var">mid</span>;
            <span class="var">r</span> = <span class="var">mid</span> - <span class="val">1</span>;
        <span class="kw">NGƯỢC LẠI</span>:
            <span class="var">l</span> = <span class="var">mid</span> + <span class="val">1</span>;
    <span class="kw">TRẢ VỀ</span> <span class="var">res</span>;
</pre>
</div>

<div class="step-card border-purple">
    <div class="step-badge bg-purple">Bảng So sánh Phương pháp</div>
    
<div class="table-wrapper">
        <table class="algo-table">
            <thead>
                <tr>
                    <th style="width: 20%;">Tiêu chí</th>
                    <th class="th-orange" style="width: 40%;">Cách 1: Sinh trực tiếp (On-the-fly)</th>
                    <th class="th-green" style="width: 40%;">Cách 2: Mảng + Tìm nhị phân</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td class="td-label">Ý tưởng</td>
                    <td>Sinh tới đâu kiểm tra tới đó, vượt ngưỡng $B$ thì dừng.</td>
                    <td>Sinh sẵn toàn bộ vào mảng, tra cứu bằng thuật toán tìm kiếm.</td>
                </tr>
                <tr>
                    <td class="td-label">Độ phức tạp Thời gian</td>
                    <td>$O(K)$ với $K \approx 90$. Gần như $O(1)$.</td>
                    <td>$O(K)$ khởi tạo ban đầu, $O(\log K)$ cho mỗi truy vấn.</td>
                </tr>
                <tr>
                    <td class="td-label">Bộ nhớ sử dụng</td>
                    <td>$O(1)$ (Chỉ lưu 3 biến $f1, f2, fn$).</td>
                    <td>$O(K)$ (Lưu mảng 90 phần tử).</td>
                </tr>
                <tr>
                    <td class="td-label">Đánh giá</td>
                    <td class="td-optimal"><b>Rất khuyên dùng.</b> Phù hợp nhất với dạng bài có 1 test case. Code cực ngắn.</td>
                    <td>Thích hợp khi thi đấu ở các nền tảng online có nhiều test case gộp (Multiple Testcases).</td>
                </tr>
            </tbody>
        </table>
    </div>
</div>