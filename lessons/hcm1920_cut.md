## ✂️ Bài 3: Cắt dây (CUT - HCM 2019-2020)
<br>
<div class="step-card border-blue">
<div class="step-badge bg-blue">Phân tích đề bài</div>

Cần cắt sợi dây độ dài $N$ ($0 < N \le 10^{18}$) thành 3 đoạn nguyên dương để tạo thành một **tam giác cân**.

Điều kiện của tam giác cân này:
1. Có 2 cạnh bên bằng nhau. Gọi độ dài cạnh bên là $x$, cạnh đáy là $y$. Ta có tổng chiều dài: $2x + y = N$.
2. **Cạnh đáy lớn hơn 2 cạnh bên:** $y > x$.
3. Các hoán vị (ví dụ 5,5,9 và 5,9,5) chỉ được tính là 1 cách cắt $\rightarrow$ Việc ta gọi 2 cạnh bên là $x$ và cạnh đáy là $y$ đã tự động triệt tiêu hoán vị.

**Yêu cầu:** Đếm số lượng cặp $(x, y)$ thỏa mãn.
<div class="important-note">

**📌 Dạng bài:** Toán học: Đại số và bất đẳng thức tam giác
</div>
</div>

<div class="step-card border-orange">
<div class="step-badge bg-orange">Cách 1: Vét cạn (Subtask 1: N ≤ 10^4)</div>

### 💡 Ý tưởng
Dùng 2 vòng lặp lồng nhau để thử tất cả các giá trị có thể có của $x$ và $y$ từ $1$ đến $N$.

Nếu cặp $(x, y)$ nào thỏa mãn đồng thời cả 3 điều kiện $2x+y = N$ và $x+x > y$ và y > x thì ta tăng biến đếm.

<pre class="pseudocode">
<span class="var">Ket_Qua</span> = <span class="val">0</span>
<span class="kw">LẶP</span> <span class="var">x</span> từ <span class="val">1</span> <span class="kw">ĐẾN</span> <span class="var">N</span>:
    <span class="kw">LẶP</span> <span class="var">y</span> từ <span class="val">1</span> <span class="kw">ĐẾN</span> <span class="var">N</span>:
        <span class="kw">NẾU</span> (<span class="val">2</span>*<span class="var">x</span> + <span class="var">y</span> == <span class="var">N</span> <span class="kw">VÀ</span> <span class="val">2</span>*<span class="var">x</span> > <span class="var">y</span> <span class="kw">VÀ</span> <span class="var">y</span> > <span class="var">x</span>) <span class="kw">THÌ</span>:
            <span class="var">Ket_Qua</span> = <span class="var">Ket_Qua</span> + <span class="val">1</span>
            
<span class="kw">XUẤT</span> <span class="var">Ket_Qua</span>
</pre>
**Đánh giá:** Độ phức tạp $O(N^2)$. Chỉ ăn được Subtask 1, với $N = 10^9$ máy tính sẽ "treo" vĩnh viễn.
</div>

<div class="step-card border-yellow">
<div class="step-badge bg-yellow">Cách 2: Toán học giới hạn y + Vòng lặp (Subtask 2: N ≤ 10^9)</div>

### 💡 Ý tưởng
Thay vì chạy 2 vòng lặp mù quáng, ta dùng Toán học để ép khoảng giá trị của cạnh đáy **y**.
1. Từ điều kiện $x < y \implies 2x < 2y$. Cộng $y$ vào 2 vế: $2x + y < 3y \implies N < 3y \implies \textbf{y > N / 3}$.
2. Từ điều kiện $y < 2x$. Cộng $y$ vào 2 vế: $2y < 2x + y \implies 2y < N \implies \textbf{y < N / 2}$.
$\Rightarrow$ Tóm lại: $\frac{N}{3} < y < \frac{N}{2}$.

Nhưng chưa đủ! Vì $2x + y = N \implies x = \frac{N - y}{2}$. Để $x$ là số nguyên, thì **$(N - y)$ phải chia hết cho 2**.

<pre class="pseudocode">
<span class="var">Ket_Qua</span> = <span class="val">0</span>
<span class="var">L_y</span> = (<span class="var">N</span> / <span class="val">3</span>) + <span class="val">1</span>
<span class="var">R_y</span> = (<span class="var">N</span> - <span class="val">1</span>) / <span class="val">2</span>

<span class="kw">LẶP</span> <span class="var">y</span> từ <span class="var">L_y</span> <span class="kw">ĐẾN</span> <span class="var">R_y</span>:
    <span class="kw">NẾU</span> ((<span class="var">N</span> - <span class="var">y</span>) % <span class="val">2</span> == <span class="val">0</span>) <span class="kw">THÌ</span>:
        <span class="var">Ket_Qua</span> = <span class="var">Ket_Qua</span> + <span class="val">1</span>

<span class="kw">XUẤT</span> <span class="var">Ket_Qua</span>
</pre>
**Đánh giá:** Độ phức tạp giảm xuống $O(N)$. Ăn được Subtask 2. Tuy nhiên, với test $N = 10^{18}$, vòng lặp vẫn phải chạy $10^{18}$ lần $\rightarrow$ Vẫn bị TLE.
</div>

<div class="step-card border-green">
<div class="step-badge bg-green">Cách 3: Lập hệ Bất phương trình (Toán học O(1))</div>

### 💡 Ý tưởng Tối ưu
Vì $N$ có thể lên tới $10^{18}$, ta tuyệt đối không thể dùng vòng lặp `for` để thử từng giá trị của $x$. Ta phải tìm ra khoảng giá trị hợp lệ của $x$ bằng Toán học.

Từ phương trình chu vi: $y = N - 2x$.
Ta có 2 điều kiện ràng buộc bắt buộc đối với độ dài $x$ và $y$:

**Điều kiện 1: Cạnh đáy > Cạnh bên**
$y > x \implies N - 2x > x \implies 3x < N \implies x < \frac{N}{3}$

**Điều kiện 2: Bất đẳng thức tam giác**
Tổng 2 cạnh bất kỳ phải lớn hơn cạnh còn lại.
- $x + y > x \implies y > 0$ (Hiển nhiên đúng vì $y = N - 2x$ và $x < \frac{N}{3}$).
- $x + x > y \implies 2x > y \implies 2x > N - 2x \implies 4x > N \implies x > \frac{N}{4}$

**Gộp 2 điều kiện lại, ta có miền giá trị của $x$:**
$$ \frac{N}{4} < x < \frac{N}{3} $$

Vì $x$ phải là số nguyên, ta làm tròn khoảng này:
- Cận dưới $L$: Số nguyên nhỏ nhất lớn hơn $\frac{N}{4} \rightarrow L = \lfloor \frac{N}{4} \rfloor + 1$
- Cận trên $R$: Số nguyên lớn nhất nhỏ hơn $\frac{N}{3} \rightarrow R = \lfloor \frac{N - 1}{3} \rfloor$

Số lượng cách cắt chính là số lượng số nguyên $x$ nằm trong đoạn $[L, R]$.
Công thức: **Số cách = $\max(0, R - L + 1)$**
</div>

<div class="step-card border-green">
<div class="step-badge bg-green">Mã giả thuật toán</div>

<pre class="pseudocode">
<span class="com">// Sử dụng kiểu dữ liệu 64-bit (long long) để tránh tràn số</span>
<span class="kw">NHẬP</span> <span class="var">N</span>

<span class="com">// Tính cận dưới L (Phải lớn hơn N / 4)</span>
<span class="var">L</span> = (<span class="var">N</span> / <span class="val">4</span>) + <span class="val">1</span>

<span class="com">// Tính cận trên R (Phải nhỏ hơn N / 3)</span>
<span class="var">R</span> = (<span class="var">N</span> - <span class="val">1</span>) / <span class="val">3</span>

<span class="kw">NẾU</span> (<span class="var">R</span> ≥ <span class="var">L</span>) <span class="kw">THÌ</span>:
    <span class="var">Ket_Qua</span> = <span class="var">R</span> - <span class="var">L</span> + <span class="val">1</span>
<span class="kw">NGƯỢC LẠI</span>:
    <span class="var">Ket_Qua</span> = <span class="val">0</span>

<span class="kw">XUẤT</span> <span class="var">Ket_Qua</span>
</pre>
</div>

<div class="step-card border-purple">
    <div class="step-badge bg-purple">Bảng Đánh giá Thuật toán</div>
    
<div class="table-wrapper">
        <table class="algo-table">
            <thead>
                <tr>
                    <th style="width: 20%;">Tiêu chí</th>
                    <th class="th-orange" style="width: 25%;">Cách 1 (Vét cạn)</th>
                    <th class="th-orange" style="width: 25%;">Cách 2 (Lặp theo B)</th>
                    <th class="th-green" style="width: 30%;">Cách 3 (Công thức theo A)</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td class="td-label">Độ phức tạp</td>
                    <td>$O(N^2)$</td>
                    <td>$O(N)$</td>
                    <td class="td-optimal"><b>$O(1)$</b></td>
                </tr>
                <tr>
                    <td class="td-label">Test Case qua được</td>
                    <td>Subtask 1 ($N \le 10^4$)</td>
                    <td>Subtask 2 ($N \le 10^9$)</td>
                    <td class="td-optimal"><b>Ăn trọn 100% Test ($10^{18}$)</b></td>
                </tr>
            </tbody>
        </table>
    </div>
</div>