## 📊 Bài 1: Sắp xếp (SAPXEP - HCM 2024-2025)
<br>
<div class="step-card border-blue">
<div class="step-badge bg-blue">Phân tích đề bài</div>

**Yêu cầu:** Đếm số lần hoán đổi (swap) khi sử dụng thuật toán Sắp xếp nổi bọt (Bubble Sort) để sắp xếp mảng $N$ phần tử tăng dần.

**Bản chất khoa học máy tính:** Mỗi lần Bubble Sort thực hiện hoán đổi 2 phần tử kề nhau ($A[i] > A[i+1]$), nó đã triệt tiêu chính xác **1 nghịch thế** trong mảng. Thuật toán kết thúc khi mảng không còn nghịch thế nào (mảng đã sắp xếp). 

$\Rightarrow$ Bài toán đếm số lần hoán đổi của Bubble Sort thực chất là bài toán kinh điển: **ĐẾM SỐ LƯỢNG NGHỊCH THẾ TRONG MẢNG**.

**⚠️ Cảnh báo Kiểu dữ liệu (Rất quan trọng):**
- Với $N = 2 \times 10^5$, mảng nếu xếp ngược hoàn toàn (ví dụ: $5, 4, 3, 2, 1$) sẽ có số nghịch thế lớn nhất là $\frac{N(N-1)}{2} \approx \frac{4 \times 10^{10}}{2} = 2 \times 10^{10}$.
- Con số này vượt quá giới hạn của số nguyên 32-bit (`int`). Bắt buộc phải dùng biến **`long long`** (64-bit) để lưu biến đếm (kết quả), nếu không sẽ bị sai số ở các test lớn.
<div class="important-note">

**📌 Dạng bài:** Mô phỏng - Merge sort
</div>
</div>

<div class="step-card border-orange">
<div class="step-badge bg-orange">Cách 1: Mô phỏng Bubble Sort (Subtask 1: N ≤ 10^3)</div>

### 💡 Ý tưởng Subtask 1 (80% Điểm)
Vì $N \le 1000$, ta cứ việc làm đúng như đề bài mô tả: Viết thuật toán Bubble Sort (2 vòng lặp lồng nhau). Cứ mỗi lần lệnh `swap` xảy ra, ta tăng biến đếm lên 1.

<pre class="pseudocode">
<span class="kw">NHẬP</span> <span class="var">N</span>
<span class="kw">NHẬP</span> mảng <span class="var">A</span> từ 1 đến N

<span class="var">Dem_Swap</span> = <span class="val">0</span> <span class="com">// Phải dùng long long</span>

<span class="kw">LẶP</span> <span class="var">i</span> từ <span class="val">1</span> <span class="kw">ĐẾN</span> <span class="var">N</span> - <span class="val">1</span>:
    <span class="kw">LẶP</span> <span class="var">j</span> từ <span class="val">1</span> <span class="kw">ĐẾN</span> <span class="var">N</span> - <span class="var">i</span>:
        <span class="kw">NẾU</span> (<span class="var">A</span>[<span class="var">j</span>] > <span class="var">A</span>[<span class="var">j</span> + <span class="val">1</span>]) <span class="kw">THÌ</span>:
            <span class="fn">Hoan_Doi</span>(<span class="var">A</span>[<span class="var">j</span>], <span class="var">A</span>[<span class="var">j</span> + <span class="val">1</span>])
            <span class="var">Dem_Swap</span> = <span class="var">Dem_Swap</span> + <span class="val">1</span>

<span class="kw">XUẤT</span> <span class="var">Dem_Swap</span>
</pre>
**Đánh giá:** Thời gian chạy $O(N^2)$. Với $N = 1000$, số phép so sánh tối đa $\approx 5 \times 10^5$, chạy chưa tới $0.01$ giây. Nhưng nếu đem chạy test $N = 2 \times 10^5$, sẽ mất $2 \times 10^{10}$ phép tính, chắc chắn bị Quá thời gian (TLE).
</div>

<div class="step-card border-green">
<div class="step-badge bg-green">Cách 2: Đếm nghịch thế bằng Merge Sort (Subtask 2 - 100% Điểm)</div>

### 💡 Ý tưởng Tối ưu (Chia để trị O(N log N))
Ta sẽ "mượn" thuật toán **Sắp xếp trộn (Merge Sort)** để đếm nghịch thế. 
Quá trình Merge Sort chia mảng làm 2 nửa trái (Left) và phải (Right) đã được sắp xếp, sau đó gộp lại. 
Trong lúc gộp (Merge), ta dùng 2 con trỏ `i` (chỉ vào Left) và `j` (chỉ vào Right):
- Nếu `Left[i] <= Right[j]`: Không có nghịch thế. Bỏ `Left[i]` vào mảng tạm.
- Nếu `Left[i] > Right[j]`: BÙM! Phát hiện nghịch thế. 
- Vì mảng Left **đã được sắp xếp tăng dần**, nên nếu phần tử `Right[j]` nhỏ hơn `Left[i]`, nó chắc chắn sẽ nhỏ hơn **TẤT CẢ** các phần tử còn lại phía sau `Left[i]` trong mảng Left.
- $\Rightarrow$ Số lượng nghịch thế sinh ra = `Số phần tử còn lại của mảng Left` = `(mid - i + 1)`. Ta cộng thẳng con số này vào kết quả. Không cần đếm từng cái một!

<pre class="pseudocode">
<span class="var">Dem_Swap</span> = <span class="val">0</span> <span class="com">// Kiểu long long</span>

<span class="kw">HÀM</span> <span class="fn">Merge</span>(<span class="var">L</span>, <span class="var">mid</span>, <span class="var">R</span>):
    <span class="var">i</span> = <span class="var">L</span>, <span class="var">j</span> = <span class="var">mid</span> + <span class="val">1</span>, <span class="var">k</span> = <span class="var">L</span>
    <span class="kw">LẶP TRONG KHI</span> (<span class="var">i</span> ≤ <span class="var">mid</span> <span class="kw">VÀ</span> <span class="var">j</span> ≤ <span class="var">R</span>):
        <span class="kw">NẾU</span> (<span class="var">A</span>[<span class="var">i</span>] ≤ <span class="var">A</span>[<span class="var">j</span>]) <span class="kw">THÌ</span>:
            <span class="var">Temp</span>[<span class="var">k</span>] = <span class="var">A</span>[<span class="var">i</span>]; <span class="var">i</span>++; <span class="var">k</span>++
        <span class="kw">NGƯỢC LẠI</span>: <span class="com">// Phát hiện A[i] > A[j] (Nghịch thế)</span>
            <span class="var">Temp</span>[<span class="var">k</span>] = <span class="var">A</span>[<span class="var">j</span>]; <span class="var">j</span>++; <span class="var">k</span>++
            <span class="com">// Cộng gộp tất cả các nghịch thế do A[j] tạo ra với phần còn lại của Left</span>
            <span class="var">Dem_Swap</span> = <span class="var">Dem_Swap</span> + (<span class="var">mid</span> - <span class="var">i</span> + <span class="val">1</span>)

    <span class="com">// Chép các phần tử còn thừa vào Temp, rồi chép Temp trả lại mảng A...</span>

<span class="kw">HÀM</span> <span class="fn">MergeSort</span>(<span class="var">L</span>, <span class="var">R</span>):
    <span class="kw">NẾU</span> (<span class="var">L</span> < <span class="var">R</span>) <span class="kw">THÌ</span>:
        <span class="var">mid</span> = (<span class="var">L</span> + <span class="var">R</span>) / <span class="val">2</span>
        <span class="fn">MergeSort</span>(<span class="var">L</span>, <span class="var">mid</span>)
        <span class="fn">MergeSort</span>(<span class="var">mid</span> + <span class="val">1</span>, <span class="var">R</span>)
        <span class="fn">Merge</span>(<span class="var">L</span>, <span class="var">mid</span>, <span class="var">R</span>)

<span class="com">// CHƯƠNG TRÌNH CHÍNH</span>
<span class="kw">NHẬP</span> mảng <span class="var">A</span>
<span class="fn">MergeSort</span>(<span class="val">1</span>, <span class="var">N</span>)
<span class="kw">XUẤT</span> <span class="var">Dem_Swap</span>
</pre>
</div>

<div class="step-card border-purple">
    <div class="step-badge bg-purple">Tổng kết: So sánh thuật toán</div>
    
<div class="table-wrapper">
        <table class="algo-table" style="font-size: 0.9rem;">
            <thead>
                <tr>
                    <th style="width: 25%;">Tiêu chí</th>
                    <th class="th-orange" style="width: 35%;">Bubble Sort (Nổi bọt)</th>
                    <th class="th-green" style="width: 40%;">Merge Sort (Trộn)</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td class="td-label">Ý tưởng</td>
                    <td>Sửa từng lỗi sai (nghịch thế) một cách thủ công, 2 phần tử kề nhau.</td>
                    <td>Chia để trị. Lợi dụng mảng con đã sắp xếp để đếm gộp nhiều lỗi sai cùng lúc.</td>
                </tr>
                <tr>
                    <td class="td-label">Độ phức tạp Thời gian</td>
                    <td>$O(N^2)$</td>
                    <td>$O(N \log N)$</td>
                </tr>
                <tr>
                    <td class="td-label">Qua test $N = 2 \times 10^5$</td>
                    <td>Mất khoảng 200 giây $\rightarrow$ <b>TLE</b>.</td>
                    <td>Mất khoảng 0.05 giây $\rightarrow$ <b>100% Điểm</b>.</td>
                </tr>
            </tbody>
        </table>
    </div>
</div>