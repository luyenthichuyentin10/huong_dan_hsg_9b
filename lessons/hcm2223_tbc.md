## ➕ Bài 1: Trung bình cộng (TBC - HCM 2022-2023)
<br>
<div class="step-card border-blue">
<div class="step-badge bg-blue">Phân tích đề bài</div>

Cho mảng $B$ gồm $N$ phần tử ($N \le 10^5$, $-10^6 \le B_i \le 10^6$).
Biết rằng $B_i$ là trung bình cộng của $i$ phần tử đầu tiên trong mảng $A$ ban đầu.

**Yêu cầu:** Khôi phục lại mảng $A$.

**Bản chất Toán học:**
- Định nghĩa trung bình cộng: $B_i = \frac{A_1 + A_2 + ... + A_i}{i}$
- Suy ra, tổng của $i$ phần tử đầu tiên trong mảng $A$ là:
  $$Sum_i = A_1 + A_2 + ... + A_i = B_i \times i$$
- Mục tiêu của ta là tìm giá trị $A_i$ ở mỗi bước.
<div class="important-note">

**📌 Dạng bài:** Toán học
</div>
</div>

<div class="step-card border-orange">
<div class="step-badge bg-orange">Cách 1: Vét cạn ngây thơ (Subtask 1: N ≤ 5)</div>

### 💡 Ý tưởng Subtask 1
Theo công thức trên, ta biết tổng $Sum_i = B_i \times i$.
Nếu ta đã tìm được các phần tử $A_1, A_2, ..., A_{i-1}$ từ các bước trước, ta chỉ việc lấy tổng $Sum_i$ trừ đi tổng của các phần tử $A$ đã biết này để suy ra $A_i$.
- Công thức: $A_i = (B_i \times i) - (A_1 + A_2 + ... + A_{i-1})$
- **Cách làm:** Dùng 2 vòng lặp lồng nhau. Vòng lặp ngoài duyệt $i$, vòng lặp trong duyệt $j$ từ $1$ đến $i-1$ để tính tổng các phần tử $A$ đã tìm được.

<pre class="pseudocode">
<span class="kw">NHẬP</span> <span class="var">N</span>
<span class="var">B</span> = <span class="fn">Mang</span>(N)
<span class="var">A</span> = <span class="fn">Mang</span>(N)

<span class="kw">LẶP</span> <span class="var">i</span> từ <span class="val">1</span> <span class="kw">ĐẾN</span> <span class="var">N</span>:
    <span class="kw">NHẬP</span> <span class="var">B</span>[<span class="var">i</span>]

<span class="kw">LẶP</span> <span class="var">i</span> từ <span class="val">1</span> <span class="kw">ĐẾN</span> <span class="var">N</span>:
    <span class="var">Tong_Muc_Tieu</span> = <span class="var">B</span>[<span class="var">i</span>] * <span class="var">i</span>
    <span class="var">Tong_A_Da_Biet</span> = <span class="val">0</span>
    
    <span class="com">// Vòng lặp trong tính tổng các A đã tìm</span>
    <span class="kw">LẶP</span> <span class="var">j</span> từ <span class="val">1</span> <span class="kw">ĐẾN</span> <span class="var">i</span> - <span class="val">1</span>:
        <span class="var">Tong_A_Da_Biet</span> = <span class="var">Tong_A_Da_Biet</span> + <span class="var">A</span>[<span class="var">j</span>]
        
    <span class="var">A</span>[<span class="var">i</span>] = <span class="var">Tong_Muc_Tieu</span> - <span class="var">Tong_A_Da_Biet</span>

<span class="kw">XUẤT</span> mảng <span class="var">A</span>
</pre>
**Đánh giá:** Độ phức tạp là $O(N^2)$. Phù hợp cho Subtask 1 ($N \le 5$) nhưng với Subtask 2 ($N = 10^5$), số phép tính là $10^{10} \rightarrow$ Chắc chắn TLE.
</div>

<div class="step-card border-green">
<div class="step-badge bg-green">Cách 2: Tối ưu bằng Công thức Toán học (Subtask 2: 100% Điểm)</div>

### 💡 Ý tưởng Subtask 2
Tại sao phải tốn vòng lặp trong để tính lại $A_1 + A_2 + ... + A_{i-1}$?
Theo định nghĩa, tổng của $i-1$ phần tử đầu tiên chính là $Sum_{i-1}$, và ta đã biết:
$$Sum_{i-1} = B_{i-1} \times (i - 1)$$

Từ đó, ta có một công thức tuyệt đẹp để tìm $A_i$ chỉ trong $O(1)$:

$$A_i = Sum_i - Sum_{i-1}$$
$$\Rightarrow A_i = B_i \times i - B_{i-1} \times (i - 1)$$

**⚠️ Cạm bẫy kiểu dữ liệu (Data Type):**
Tuy $B_i \le 10^6$, nhưng khi nhân với $i \le 10^5$, giá trị $Sum_i$ có thể lên tới $10^{11}$. Con số này vượt quá giới hạn của số nguyên 32-bit (`int`). Bắt buộc phải dùng kiểu `long long` (64-bit) cho các phép tính tổng và mảng $A$.

<pre class="pseudocode">
<span class="com">// Dùng kiểu long long cho B và A</span>
<span class="kw">NHẬP</span> <span class="var">N</span>
<span class="var">B</span> = <span class="fn">Mang</span>(N)
<span class="var">A</span> = <span class="fn">Mang</span>(N)

<span class="var">B</span>[<span class="val">0</span>] = <span class="val">0</span> <span class="com">// Phần tử rào</span>

<span class="kw">LẶP</span> <span class="var">i</span> từ <span class="val">1</span> <span class="kw">ĐẾN</span> <span class="var">N</span>:
    <span class="kw">NHẬP</span> <span class="var">B</span>[<span class="var">i</span>]

<span class="kw">LẶP</span> <span class="var">i</span> từ <span class="val">1</span> <span class="kw">ĐẾN</span> <span class="var">N</span>:
    <span class="var">Sum_hien_tai</span> = <span class="var">B</span>[<span class="var">i</span>] * <span class="var">i</span>
    <span class="var">Sum_truoc_do</span> = <span class="var">B</span>[<span class="var">i</span>-<span class="val">1</span>] * (<span class="var">i</span>-<span class="val">1</span>)
    
    <span class="var">A</span>[<span class="var">i</span>] = <span class="var">Sum_hien_tai</span> - <span class="var">Sum_truoc_do</span>

<span class="kw">XUẤT</span> mảng <span class="var">A</span>
</pre>
</div>

<div class="step-card border-purple">
    <div class="step-badge bg-purple">Bảng Đánh giá Thuật toán</div>
    
<div class="table-wrapper">
        <table class="algo-table">
            <thead>
                <tr>
                    <th style="width: 25%;">Tiêu chí</th>
                    <th class="th-orange" style="width: 37%;">Cách 1 (Vét cạn $O(N^2)$)</th>
                    <th class="th-green" style="width: 38%;">Cách 2 (Toán học $O(N)$)</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td class="td-label">Bản chất</td>
                    <td>Dùng 2 vòng lặp, tự động tính lại tổng mảng A mỗi bước.</td>
                    <td>Dùng công thức trừ hai tổng: $B_i \times i - B_{i-1} \times (i-1)$</td>
                </tr>
                <tr>
                    <td class="td-label">Kết quả</td>
                    <td>Mất khoảng 10 giây cho test lớn $\rightarrow$ <b>TLE (50% điểm)</b></td>
                    <td>Chạy chưa tới 0.05 giây $\rightarrow$ <b>100% điểm</b></td>
                </tr>
            </tbody>
        </table>
    </div>
</div>