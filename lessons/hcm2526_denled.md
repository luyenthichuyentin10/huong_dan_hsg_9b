## 🚦 Bài 2: Hệ thống đèn LED (Đề tham khảo HCM 25-26)
<br>
<div class="step-card border-blue">
<div class="step-badge bg-blue">Phân tích đề bài</div>

**Yêu cầu:** Cho $N$ đèn LED với công suất $A_i$. Tìm một tập hợp con sao cho tổng công suất chia hết cho $K$, đạt giá trị lớn nhất và $\ge K$.
<div class="important-note">

**📌 Dạng bài:** Quy hoạch động theo modulo
</div>
</div>

<div class="step-card border-orange">
<div class="step-badge bg-orange">Cách 1: Sinh tập con / Backtracking (Subtask 1: N ≤ 20)</div>

### 💡 Ý tưởng Subtask 1 (30% Điểm)
Với $N \le 20$, số lượng tập con có thể tạo ra là $2^{20} \approx 10^6$. Ta hoàn toàn có thể dùng Đệ quy quay lui (Backtracking) hoặc Duyệt bit (Bitmask) để sinh ra mọi tập hợp con có thể. Tính tổng của từng tập, kiểm tra điều kiện chia hết cho $K$ và cập nhật giá trị Max.

<pre class="pseudocode">
<span class="var">Max_Sum</span> = <span class="val">0</span>
<span class="kw">HÀM</span> <span class="fn">Backtrack</span>(<span class="var">i</span>, <span class="var">Current_Sum</span>):
    <span class="kw">NẾU</span> (<span class="var">i</span> > <span class="var">N</span>) <span class="kw">THÌ</span>:
        <span class="kw">NẾU</span> (<span class="var">Current_Sum</span> % <span class="var">K</span> == <span class="val">0</span> <span class="kw">VÀ</span> <span class="var">Current_Sum</span> >= <span class="var">K</span>) <span class="kw">THÌ</span>:
            <span class="var">Max_Sum</span> = <span class="fn">MAX</span>(<span class="var">Max_Sum</span>, <span class="var">Current_Sum</span>)
        <span class="kw">TRẢ VỀ</span>
    
    <span class="com">// Nhánh 1: Không chọn đèn thứ i</span>
    <span class="fn">Backtrack</span>(<span class="var">i</span> + <span class="val">1</span>, <span class="var">Current_Sum</span>)
    <span class="com">// Nhánh 2: Chọn đèn thứ i</span>
    <span class="fn">Backtrack</span>(<span class="var">i</span> + <span class="val">1</span>, <span class="var">Current_Sum</span> + <span class="var">A</span>[<span class="var">i</span>])
</pre>
**Đánh giá:** Thuật toán chạy $O(2^N)$, qua dễ dàng Subtask 1 nhưng sẽ TLE ngay lập tức nếu $N=1000$.
</div>

<div class="step-card border-green">
<div class="step-badge bg-green">Cách 2: Tính chất chẵn lẻ (Subtask 2: K = 2)</div>

### 💡 Ý tưởng Subtask 2 (20% Điểm)
Khi $K = 2$, yêu cầu "chia hết cho 2" đồng nghĩa với việc tìm **Tổng chẵn lớn nhất**. 
Ta làm cực kỳ đơn giản trong $O(N)$:
1. Cộng tổng tất cả các phần tử $A_i$ lại thành $S$.
2. Nếu $S$ chẵn $\rightarrow$ Đó chính là đáp án.
3. Nếu $S$ lẻ $\rightarrow$ Ta chỉ việc loại bỏ ra **1 phần tử lẻ nhỏ nhất** trong mảng để $S$ biến thành chẵn.

<pre class="pseudocode">
<span class="var">S</span> = <span class="val">0</span>, <span class="var">Min_Odd</span> = <span class="val">VÔ CỰC</span>
<span class="kw">LẶP</span> <span class="var">i</span> từ <span class="val">1</span> <span class="kw">ĐẾN</span> <span class="var">N</span>:
    <span class="var">S</span> = <span class="var">S</span> + <span class="var">A</span>[<span class="var">i</span>]
    <span class="kw">NẾU</span> (<span class="var">A</span>[<span class="var">i</span>] % <span class="val">2</span> != <span class="val">0</span>) <span class="kw">THÌ</span>:
        <span class="var">Min_Odd</span> = <span class="fn">MIN</span>(<span class="var">Min_Odd</span>, <span class="var">A</span>[<span class="var">i</span>])

<span class="kw">NẾU</span> (<span class="var">S</span> % <span class="val">2</span> == <span class="val">1</span>) <span class="kw">THÌ</span> <span class="var">S</span> = <span class="var">S</span> - <span class="var">Min_Odd</span>
<span class="kw">XUẤT</span> <span class="var">S</span>
</pre>
</div>

<div class="step-card border-blue">
<div class="step-badge bg-blue">Cách 3: Quy hoạch động cái túi (Subtask 3: Tổng ≤ 10^4)</div>

### 💡 Ý tưởng Subtask 3 (20% Điểm)
Tổng công suất rất nhỏ ($\le 10^4$). Ta có thể dùng mảng đánh dấu `dp[s]` (Đúng/Sai) để lưu xem có thể tạo ra tổng bằng $s$ hay không.
Đây chính là bài toán **Cái túi (Knapsack) 1 chiều**.
Cuối cùng, duyệt ngược từ $s = 10^4$ về $0$, tìm tổng $s$ đầu tiên thỏa mãn `dp[s] == True` và `s % K == 0`.

<pre class="pseudocode">
<span class="var">DP</span> = <span class="fn">Mang</span>(10005, <span class="kw">SAI</span>)
<span class="var">DP</span>[<span class="val">0</span>] = <span class="kw">ĐÚNG</span>

<span class="kw">LẶP</span> <span class="var">i</span> từ <span class="val">1</span> <span class="kw">ĐẾN</span> <span class="var">N</span>:
    <span class="kw">LẶP</span> <span class="var">s</span> từ <span class="val">10000</span> <span class="kw">GIẢM VỀ</span> <span class="var">A</span>[<span class="var">i</span>]:
        <span class="kw">NẾU</span> (<span class="var">DP</span>[<span class="var">s</span> - <span class="var">A</span>[<span class="var">i</span>]] == <span class="kw">ĐÚNG</span>) <span class="kw">THÌ</span> <span class="var">DP</span>[<span class="var">s</span>] = <span class="kw">ĐÚNG</span>
</pre>
**Đánh giá:** Chạy với $O(N \times \text{Tổng MAX}) \approx 10^7$ phép tính. Nhưng qua Subtask 4 tổng có thể lên tới $10^{12}$, mảng DP sẽ tràn bộ nhớ.
</div>

<div class="step-card border-purple">
<div class="step-badge bg-purple">Cách 4: DP theo Số dư Modulo (Subtask 4 - 100% Điểm)</div>

### 1. Tại sao lại là Quy hoạch động theo Số dư (DP on Modulo)?
Trong cách giải sub3, ta gọi $DP[s]$ là tổng lớn nhất để đạt được tổng là $s$. Nhưng ở sub4 này, tổng công suất tối đa có thể lên tới $N \times \max(A_i) = 1000 \times 10^9 = 10^{12}$. Việc tạo một mảng có kích thước $10^{12}$ là bất khả thi (tràn RAM).

Tuy nhiên, mục tiêu cuối cùng của đề bài chỉ là **"chia hết cho K"**. Điều này gợi ý ta sử dụng **Toán học Đồng dư (Modulo)**. 
- Mọi con số trên đời khi chia cho $K$ đều chỉ có thể tạo ra $K$ trường hợp số dư: từ $0$ đến $K-1$.
- Ví dụ với $K = 6$, các tổng $12, 18, 120$ đều có số dư là $0$. Ta không cần phải nhớ tất cả các tổng này, ta chỉ cần nhớ **tổng lớn nhất** trong số chúng.

**Định nghĩa trạng thái:**
Gọi <code>DP[r]</code> là **tổng công suất lớn nhất** được chọn ra sao cho tổng đó chia cho $K$ dư $r$.
Mảng <code>DP</code> lúc này chỉ cần khai báo đúng $K$ phần tử (rất nhỏ, vì $K \le 100$).

**Công thức chuyển trạng thái:**
Khi xét đến việc có chọn thêm cái đèn $A_i$ hay không, ta có 2 lựa chọn:
1. **Không chọn $A_i$:** Số dư không đổi, tổng không đổi.
2. **Chọn $A_i$:** Nếu ta cộng $A_i$ vào một tập hợp đang có số dư $r$, thì tổng mới sẽ có số dư là $(r + A_i) \pmod K$. 

Vậy, ta sẽ cập nhật giá trị cho số dư mới: 
$$DP[new\_r] = \max(DP[new\_r], DP[r] + A_i)$$

---

### 2. Ví dụ minh họa (Trace thuật toán)

Xét ví dụ: $N = 3, K = 6$, các đèn có công suất $A = [10, 2, 4]$.
Khởi tạo mảng <code>DP</code> gồm 6 phần tử. Ban đầu chưa chọn gì, tổng $= 0$, số dư $= 0$. Các trạng thái khác chưa thể tạo ra nên gán bằng $-\infty$.
* **Ban đầu:** <code>DP = [0, -INF, -INF, -INF, -INF, -INF]</code>

**🔥 Bước 1: Xét đèn $A_1 = 10$**
Ta quét mảng <code>DP</code> cũ, chỉ thấy <code>DP[0] = 0</code> là hợp lệ (khác $-\infty$).
- Lấy <code>DP[0]</code> ghép với $10$: Tổng mới $= 0 + 10 = 10$.
- Số dư mới: $10 \pmod 6 = 4$.
- Cập nhật: <code>DP[4] = max(-INF, 10) = 10</code>.
* **Sau bước 1:** <code>DP = [0, -INF, -INF, -INF, 10, -INF]</code>

**🔥 Bước 2: Xét đèn $A_2 = 2$**
Ta quét mảng <code>DP</code> cũ, thấy có <code>DP[0] = 0</code> và <code>DP[4] = 10</code> là hợp lệ.
- Từ <code>DP[0] = 0</code>: Ghép thêm $2 \rightarrow$ Tổng mới $= 2$. Số dư $= 2 \pmod 6 = 2 \rightarrow$ Cập nhật <code>DP[2] = 2</code>.
- Từ <code>DP[4] = 10</code>: Ghép thêm $2 \rightarrow$ Tổng mới $= 10 + 2 = 12$. Số dư $= 12 \pmod 6 = 0 \rightarrow$ Cập nhật <code>DP[0] = max(0, 12) = 12</code>.
* **Sau bước 2:** <code>DP = [12, -INF, 2, -INF, 10, -INF]</code>

**🔥 Bước 3: Xét đèn $A_3 = 4$**
Quét mảng <code>DP</code> cũ, các ô hợp lệ là $0, 2, 4$.
- Từ <code>DP[0] = 12</code>: Ghép $4 \rightarrow$ Tổng $= 16$, số dư $= 16 \pmod 6 = 4 \rightarrow$ Cập nhật <code>DP[4] = max(10, 16) = 16</code>.
- Từ <code>DP[2] = 2</code>: Ghép $4 \rightarrow$ Tổng $= 6$, số dư $= 6 \pmod 6 = 0 \rightarrow$ Cập nhật <code>DP[0] = max(12, 6) = 12</code>.
- Từ <code>DP[4] = 10</code>: Ghép $4 \rightarrow$ Tổng $= 14$, số dư $= 14 \pmod 6 = 2 \rightarrow$ Cập nhật <code>DP[2] = max(2, 14) = 14</code>.
* **Sau bước 3:** <code>DP = [12, -INF, 14, -INF, 16, -INF]</code>

**Kết luận:** Quét xong cả 3 đèn. Ta cần tổng chia hết cho 6 (số dư $= 0$). Nhìn vào <code>DP[0]</code>, giá trị lớn nhất là **12**.

---

### 3. Mã giả thuật toán

<pre class="pseudocode">
<span class="var">DP</span> = <span class="fn">Mang</span>(K, -<span class="val">VÔ CỰC</span>)
<span class="var">DP</span>[<span class="val">0</span>] = <span class="val">0</span> <span class="com">// Ban đầu chưa chọn gì, tổng = 0, số dư = 0</span>

<span class="kw">LẶP</span> <span class="var">i</span> từ <span class="val">1</span> <span class="kw">ĐẾN</span> <span class="var">N</span>:
    <span class="var">Next_DP</span> = <span class="fn">Copy</span>(<span class="var">DP</span>) <span class="com">// Dùng mảng tạm để không cộng dồn phần tử i nhiều lần vì đề chỉ cho mỗi bóng đèn được dùng 1 lần</span>
    <span class="kw">LẶP</span> số dư <span class="var">r</span> từ <span class="val">0</span> <span class="kw">ĐẾN</span> <span class="var">K</span> - <span class="val">1</span>:
        <span class="kw">NẾU</span> (<span class="var">DP</span>[<span class="var">r</span>] ≠ -<span class="val">VÔ CỰC</span>) <span class="kw">THÌ</span>:
            <span class="var">new_r</span> = (<span class="var">r</span> + <span class="var">A</span>[<span class="var">i</span>]) % <span class="var">K</span>
            <span class="var">Next_DP</span>[<span class="var">new_r</span>] = <span class="fn">MAX</span>(<span class="var">Next_DP</span>[<span class="var">new_r</span>], <span class="var">DP</span>[<span class="var">r</span>] + <span class="var">A</span>[<span class="var">i</span>])
    <span class="var">DP</span> = <span class="var">Next_DP</span>

<span class="kw">NẾU</span> (<span class="var">DP</span>[<span class="val">0</span>] > <span class="val">0</span>) <span class="kw">XUẤT</span> <span class="var">DP</span>[<span class="val">0</span>] <span class="com">// Lấy tổng lớn nhất có số dư = 0</span>
</pre>

**Đánh giá:** Thuật toán nén không gian trạng thái từ $O(\text{Tổng})$ xuống chỉ còn $O(K)$. Thời gian $O(N \times K) \approx 10^5$ phép tính, chạy chớp mắt 0.01s lấy trọn vẹn 100% điểm.
</div>

<div class="step-card border-purple">
    <div class="step-badge bg-purple">Tổng kết: So sánh & Đánh giá 4 phương pháp</div>
    
<p>Bài toán <b>Hệ thống đèn LED</b> là một ví dụ hoàn hảo về hành trình tiến hóa của thuật toán. Việc nén không gian trạng thái từ "Tổng giá trị" xuống "Số dư" chính là chìa khóa để đạt điểm tuyệt đối. Dưới đây là bảng so sánh chi tiết:</p>

<div class="table-wrapper">
        <table class="algo-table" style="font-size: 0.85rem;">
            <thead>
                <tr>
                    <th style="width: 12%;">Tiêu chí</th>
                    <th style="width: 22%; background-color: #f97316; color: white;">1. Sinh tập con (Backtrack)</th>
                    <th style="width: 22%; background-color: #22c55e; color: white;">2. Tính chẵn lẻ (Toán học)</th>
                    <th style="width: 22%; background-color: #3b82f6; color: white;">3. DP Cái túi (Theo Tổng)</th>
                    <th style="width: 22%; background-color: #a855f7; color: white;">4. DP Modulo (Theo Số dư)</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td class="td-label">Ý tưởng cốt lõi</td>
                    <td>Thử chọn/không chọn cho từng bóng đèn. Tính tổng và kiểm tra điều kiện.</td>
                    <td>(Chỉ áp dụng K=2). Lấy tổng toàn bộ. Nếu lẻ thì hi sinh trừ đi 1 bóng đèn lẻ nhỏ nhất.</td>
                    <td>Dùng mảng <code>DP[s] = True/False</code> để lưu xem có thể tạo ra tổng công suất bằng <code>s</code> hay không.</td>
                    <td>Dùng mảng <code>DP[r] = Tổng Max</code> để lưu tổng lớn nhất có số dư <code>r</code> khi chia cho K.</td>
                </tr>
                <tr>
                    <td class="td-label">Độ phức tạp Thời gian</td>
                    <td><b>$O(2^N)$</b><br>(Tăng theo cấp số nhân)</td>
                    <td><b>$O(N)$</b><br>(Chỉ cần duyệt mảng 1 lần)</td>
                    <td><b>$O(N \times \text{Tổng MAX})$</b><br>(Phụ thuộc vào giá trị của đèn)</td>
                    <td><b>$O(N \times K)$</b><br>(Hoàn toàn không phụ thuộc vào công suất)</td>
                </tr>
                <tr>
                    <td class="td-label">Độ phức tạp Bộ nhớ</td>
                    <td>$O(N)$<br>(Stack đệ quy)</td>
                    <td>$O(1)$<br>(Chỉ cần vài biến int)</td>
                    <td>$O(\text{Tổng MAX})$<br>(Mảng DP lên tới hàng vạn phần tử)</td>
                    <td><b>$O(K)$</b><br>(Mảng DP chỉ có đúng K phần tử)</td>
                </tr>
                <tr>
                    <td class="td-label">Giới hạn qua test</td>
                    <td>Subtask 1 ($N \le 20$)</td>
                    <td>Subtask 2 ($K = 2$)</td>
                    <td>Subtask 3 (Tổng $\le 10^4$)</td>
                    <td><b>100% Điểm (Subtask 4)</b></td>
                </tr>
                <tr>
                    <td class="td-label">Bài học</td>
                    <td>Rèn luyện kỹ năng đệ quy quay lui / duyệt bit cơ bản. Dùng để "chống cháy" lấy điểm.</td>
                    <td>Kỹ năng nhận diện và bóc tách các trường hợp đặc biệt bằng Toán học.</td>
                    <td>Ôn tập quy hoạch động cơ bản: Dùng mảng 1 chiều đánh dấu trạng thái.</td>
                    <td>Cảnh giới cao của DP: <b>Nén trạng thái</b>. Chuyển từ việc quan tâm "Giá trị" sang quan tâm "Tính chất" (Số dư).</td>
                </tr>
            </tbody>
        </table>
    </div>
</div>