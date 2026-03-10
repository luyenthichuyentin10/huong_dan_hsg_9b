## 📈 Bài: Phân tích số (ANALYSE - HCM 2015-2016)
<br>
<div class="step-card border-blue">
<div class="step-badge bg-blue">Phân tích đề bài</div>

Cho 2 số nguyên dương $I, J$ ($1 \le I, J \le 10^{16}$).

**Yêu cầu:** Tính tổng tất cả các ước số nguyên dương của $I$ và tổng tất cả các ước số nguyên dương của $J$, sau đó cộng chúng lại với nhau.

**Ví dụ:** $I = 12, J = 6$.
- Các ước của 12 là: 1, 2, 3, 4, 6, 12 $\rightarrow$ Tổng = 28.
- Các ước của 6 là: 1, 2, 3, 6 $\rightarrow$ Tổng = 12.
$\Rightarrow$ Kết quả = 28 + 12 = **40**.
<div class="important-note">

**📌 Dạng bài:** Số học, tính chất ước số  
</div>
</div>

<div class="step-card border-orange">
<div class="step-badge bg-orange">Cách 1: Vét cạn (O(N) - Chỉ được 50% điểm)</div>

### 💡 Ý tưởng
Cách tự nhiên nhất là để tìm ước của một số $N$, ta lặp biến $i$ từ $1$ đến $N$. Nếu $N$ chia hết cho $i$ ($N \% i == 0$) thì cộng $i$ vào tổng. Ta làm việc này lần lượt cho cả $I$ và $J$.

**Hạn chế:** Khi $N = 10^{16}$, máy tính phải chạy $10^{16}$ phép chia. Giới hạn thời gian 1 giây chỉ cho phép khoảng $10^8$ phép tính. Chắc chắn sẽ bị TLE (Time Limit Exceeded) với 50% test cuối.

<pre class="pseudocode">
<span class="kw">HÀM</span> <span class="fn">TongUoc_O_N</span>(<span class="var">N</span>):
    <span class="var">tong</span> = <span class="val">0</span>
    <span class="kw">LẶP</span> <span class="var">i</span> từ <span class="val">1</span> <span class="kw">ĐẾN</span> <span class="var">N</span>:
        <span class="kw">NẾU</span> (<span class="var">N</span> % <span class="var">i</span> == <span class="val">0</span>) <span class="kw">THÌ</span>:
            <span class="var">tong</span> = <span class="var">tong</span> + <span class="var">i</span>
    <span class="kw">TRẢ VỀ</span> <span class="var">tong</span>

<span class="kw">NHẬP</span> <span class="var">I</span>, <span class="var">J</span>
<span class="kw">XUẤT</span> <span class="fn">TongUoc_O_N</span>(<span class="var">I</span>) + <span class="fn">TongUoc_O_N</span>(<span class="var">J</span>)
</pre>
</div>

<div class="step-card border-green">
<div class="step-badge bg-green">Cách 2: Cặp ước số - O(√N) (Tối ưu 100% điểm)</div>

### 💡 Khám phá Toán học
Ước số luôn xuất hiện theo cặp. Giả sử $N$ chia hết cho $i$, thì chắc chắn $N$ cũng sẽ chia hết cho $(N / i)$.
*Ví dụ với $N = 12$:*
- Thử $i = 1 \rightarrow$ ta có cặp ước $(1, 12)$.
- Thử $i = 2 \rightarrow$ ta có cặp ước $(2, 6)$.
- Thử $i = 3 \rightarrow$ ta có cặp ước $(3, 4)$.

Vì vậy, ta chỉ cần lặp $i$ đến **căn bậc hai của N** ($\sqrt{N}$). Tại mỗi bước, ta sẽ tìm được cùng lúc 2 ước số là $i$ và $N/i$.

⚠️ **Lưu ý cực kỳ quan trọng:** Nếu $N$ là số chính phương (ví dụ $N = 16$, $i = 4$), thì cặp ước sẽ bị trùng nhau $(4, 4)$. Ta chỉ được phép cộng số này 1 lần.

<pre class="pseudocode">
<span class="kw">HÀM</span> <span class="fn">TongUoc_O_Sqrt</span>(<span class="var">N</span>):
    <span class="var">tong</span> = <span class="val">0</span>
    <span class="kw">LẶP</span> <span class="var">i</span> từ <span class="val">1</span> <span class="kw">ĐẾN</span> <span class="fn">SQRT</span>(<span class="var">N</span>):  <span class="com">// Hoặc viết là: LẶP TRONG KHI (i * i ≤ N)</span>
        <span class="kw">NẾU</span> (<span class="var">N</span> % <span class="var">i</span> == <span class="val">0</span>) <span class="kw">THÌ</span>:
            <span class="var">tong</span> = <span class="var">tong</span> + <span class="var">i</span>        <span class="com">// Cộng ước nhỏ</span>
            <span class="var">uoc_lon</span> = <span class="var">N</span> / <span class="var">i</span>
            <span class="kw">NẾU</span> (<span class="var">uoc_lon</span> ≠ <span class="var">i</span>) <span class="kw">THÌ</span>: <span class="com">// Tránh cộng trùng nếu N là số chính phương</span>
                <span class="var">tong</span> = <span class="var">tong</span> + <span class="var">uoc_lon</span>
    <span class="kw">TRẢ VỀ</span> <span class="var">tong</span>

<span class="kw">NHẬP</span> <span class="var">I</span>, <span class="var">J</span>
<span class="com">// Dùng kiểu dữ liệu 64-bit (long long) để tránh tràn số</span>
<span class="kw">XUẤT</span> <span class="fn">TongUoc_O_Sqrt</span>(<span class="var">I</span>) + <span class="fn">TongUoc_O_Sqrt</span>(<span class="var">J</span>)
</pre>
</div>

<div class="step-card border-purple">
    <div class="step-badge bg-purple">Bảng So sánh 2 Phương pháp</div>
    
<div class="table-wrapper">
        <table class="algo-table">
            <thead>
                <tr>
                    <th style="width: 20%;">Tiêu chí</th>
                    <th class="th-orange" style="width: 40%;">Cách 1: Lặp đến N</th>
                    <th class="th-green" style="width: 40%;">Cách 2: Lặp đến √N (Tìm cặp)</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td class="td-label">Độ phức tạp Thời gian</td>
                    <td>$O(N)$ (Số lần lặp bằng chính $N$).</td>
                    <td>$O(\sqrt{N})$ (Số lần lặp bằng căn bậc hai của $N$).</td>
                </tr>
                <tr>
                    <td class="td-label">Số phép tính với $N = 10^{16}$</td>
                    <td>$10^{16}$ phép lặp (Tốn hàng trăm ngày để chạy).</td>
                    <td>$\sqrt{10^{16}} = 10^8$ phép lặp (Chạy chưa tới 0.1 giây).</td>
                </tr>
                <tr>
                    <td class="td-label">Kết quả chấm điểm</td>
                    <td class="td-warning"><b>50% điểm</b> (TLE các test lớn).</td>
                    <td class="td-optimal"><b>100% điểm</b> (Chạy mượt mà mọi test).</td>
                </tr>
            </tbody>
        </table>
    </div>
</div>