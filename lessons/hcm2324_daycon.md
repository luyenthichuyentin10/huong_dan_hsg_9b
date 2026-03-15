## 🧩 Bài 2: Dãy con (HCM 2023-2024)
<br>
<div class="step-card border-blue">
<div class="step-badge bg-blue">Phân tích đề bài</div>

Cho mảng $A$ gồm $n$ **số nguyên dương**. Cần đếm số lượng dãy con liên tiếp có tổng $\ge k$.

Giới hạn cao nhất: $n \le 10^5$, $k \le 10^9$, $A_i \le 10^9$.

**⚠️ Phân tích kiểu dữ liệu:**
- Biến lưu **tổng dãy con** có thể lên tới $10^5 \times 10^9 = 10^{14}$ $\rightarrow$ Phải dùng `long long`.
- Biến lưu **tổng số lượng dãy con thỏa mãn** có thể lên tới $\frac{n(n+1)}{2} \approx \frac{10^{10}}{2} = 5 \times 10^9$ $\rightarrow$ Phải dùng `long long`.
Nếu học sinh dùng `int` cho biến đếm kết quả, các em sẽ bị sai số (tràn biến) ở những test lớn nhất.
<div class="important-note">

**📌 Dạng bài:** Two pointer - Sliding window
</div>
</div>

<div class="step-card border-orange">
<div class="step-badge bg-orange">Cách 1: Vét cạn 3 vòng lặp (Subtask 1: N ≤ 100)</div>

### 💡 Ý tưởng Subtask 1
Cách ngây thơ nhất: Để tạo ra mọi dãy con liên tiếp, ta dùng 2 vòng lặp chỉ định điểm đầu $L$ và điểm cuối $R$. Với mỗi cặp $(L, R)$, ta dùng thêm 1 vòng lặp thứ 3 chạy từ $L$ đến $R$ để tính tổng. Nếu tổng $\ge k$, ta tăng biến đếm.

<pre class="pseudocode">
<span class="var">Dem</span> = <span class="val">0</span>
<span class="kw">LẶP</span> <span class="var">L</span> từ <span class="val">1</span> <span class="kw">ĐẾN</span> <span class="var">n</span>:
    <span class="kw">LẶP</span> <span class="var">R</span> từ <span class="var">L</span> <span class="kw">ĐẾN</span> <span class="var">n</span>:
        <span class="var">Tong</span> = <span class="val">0</span>
        <span class="kw">LẶP</span> <span class="var">i</span> từ <span class="var">L</span> <span class="kw">ĐẾN</span> <span class="var">R</span>:
            <span class="var">Tong</span> = <span class="var">Tong</span> + <span class="var">A</span>[<span class="var">i</span>]
        <span class="kw">NẾU</span> (<span class="var">Tong</span> ≥ <span class="var">k</span>) <span class="kw">THÌ</span> <span class="var">Dem</span> = <span class="var">Dem</span> + <span class="val">1</span>
</pre>
**Đánh giá:** Thuật toán mất $O(N^3)$. Với $N=100$, số phép tính khoảng $10^6$, chạy tốt trong 1 giây để lấy 60% số điểm. Nhưng sẽ chết cứng nếu $N$ lớn hơn.
</div>

<div class="step-card border-yellow">
<div class="step-badge bg-yellow">Cách 2: Vét cạn 2 vòng lặp (Subtask 2: N ≤ 1000)</div>

### 💡 Ý tưởng Subtask 2
Ta không cần vòng lặp thứ 3 để tính lại tổng từ đầu. Khi cố định $L$, nếu ta tịnh tiến $R$ sang phải từng bước 1, ta chỉ việc lấy tổng cũ cộng thêm phần tử mới $A[R]$. 

<pre class="pseudocode">
<span class="var">Dem</span> = <span class="val">0</span>
<span class="kw">LẶP</span> <span class="var">L</span> từ <span class="val">1</span> <span class="kw">ĐẾN</span> <span class="var">n</span>:
    <span class="var">Tong</span> = <span class="val">0</span>
    <span class="kw">LẶP</span> <span class="var">R</span> từ <span class="var">L</span> <span class="kw">ĐẾN</span> <span class="var">n</span>:
        <span class="var">Tong</span> = <span class="var">Tong</span> + <span class="var">A</span>[<span class="var">R</span>]
        <span class="kw">NẾU</span> (<span class="var">Tong</span> ≥ <span class="var">k</span>) <span class="kw">THÌ</span> <span class="var">Dem</span> = <span class="var">Dem</span> + <span class="val">1</span>
</pre>
**Đánh giá:** Thời gian giảm xuống $O(N^2)$. Với $N=1000$, số phép tính $\approx 5 \times 10^5$, dư sức qua 90% số điểm. Nhưng với $N=10^5$, sẽ mất $10^{10}$ phép tính $\rightarrow$ TLE ở test cuối.
</div>

<div class="step-card border-green">
<div class="step-badge bg-green">Cách 3: Cửa sổ trượt / Hai con trỏ (Subtask 3 - 100% Điểm)</div>

### 💡 Ý tưởng Tối ưu O(N)
Do mọi phần tử đều là **số nguyên dương**, khi ta kéo giãn dãy con, tổng chỉ có thể TĂNG LÊN. 
Giả sử ta cố định đầu trái tại $L$, và tìm được vị trí đầu phải $R$ **nhỏ nhất** sao cho tổng đoạn $A[L..R] \ge k$. 
Vì tổng luôn tăng, ta có thể chắc chắn 100% rằng các đoạn dài hơn như $A[L..R+1], A[L..R+2], ..., A[L..n]$ cũng sẽ có tổng $\ge k$! 
$\Rightarrow$ Ta không cần duyệt tiếp, mà **cộng thẳng $(n - R + 1)$ vào kết quả**.

Sau khi tính xong cho chốt $L$, ta dịch $L$ sang phải 1 bước (loại bỏ $A[L]$ ra khỏi tổng). Lúc này $R$ không cần phải chạy lại từ $L$, mà nó cứ tiếp tục tiến lên từ vị trí cũ.

<pre class="pseudocode">
<span class="kw">NHẬP</span> <span class="var">n</span>, <span class="var">k</span>
<span class="kw">NHẬP</span> mảng <span class="var">A</span> (chỉ số từ 1 đến n)

<span class="var">Dem</span> = <span class="val">0</span>
<span class="var">Tong</span> = <span class="val">0</span>
<span class="var">R</span> = <span class="val">1</span>

<span class="kw">LẶP</span> <span class="var">L</span> từ <span class="val">1</span> <span class="kw">ĐẾN</span> <span class="var">n</span>:
    <span class="com">// Mở rộng R sang phải cho đến khi đủ k hoặc hết mảng</span>
    <span class="kw">LẶP TRONG KHI</span> (<span class="var">R</span> ≤ <span class="var">n</span> <span class="kw">VÀ</span> <span class="var">Tong</span> < <span class="var">k</span>):
        <span class="var">Tong</span> = <span class="var">Tong</span> + <span class="var">A</span>[<span class="var">R</span>]
        <span class="var">R</span> = <span class="var">R</span> + <span class="val">1</span>
    
    <span class="com">// Nếu đã đủ k (R lúc này đang đứng ở vị trí R_thực_sự + 1)</span>
    <span class="kw">NẾU</span> (<span class="var">Tong</span> ≥ <span class="var">k</span>) <span class="kw">THÌ</span>:
        <span class="com">// Đếm toàn bộ các dãy con kéo dài đến cuối mảng</span>
        <span class="var">Dem</span> = <span class="var">Dem</span> + (<span class="var">n</span> - <span class="var">R</span> + <span class="val">2</span>) 
        
    <span class="com">// Chuẩn bị dịch L sang phải: Trừ đi phần tử A[L]</span>
    <span class="var">Tong</span> = <span class="var">Tong</span> - <span class="var">A</span>[<span class="var">L</span>]

<span class="kw">XUẤT</span> <span class="var">Dem</span>
</pre>
**Đánh giá:** Mỗi phần tử $A[i]$ chỉ được con trỏ $R$ thêm vào 1 lần, và con trỏ $L$ loại ra 1 lần. Vòng lặp `while` bên trong tưởng là $O(N^2)$ nhưng thực chất tổng thời gian chạy trong suốt chương trình chỉ tốn $O(N)$. Chạy chưa tới $0.01$ giây cho mảng $10^5$.
</div>

<div class="step-card border-purple">
    <div class="step-badge bg-purple">Tổng kết: Đánh giá & So sánh các phương pháp giải</div>
    
<p>Bài toán <b>Dãy con (DAYCON)</b> là một ví dụ mẫu mực về hành trình tối ưu hóa thuật toán. Điểm mấu chốt tạo nên sự khác biệt của Cách 3 chính là việc phát hiện và khai thác triệt để tính chất <b>"mảng gồm các số nguyên dương"</b> (tổng luôn tăng). Dưới đây là bảng so sánh chi tiết:</p>

<div class="table-wrapper">
        <table class="algo-table" style="font-size: 0.9rem;">
            <thead>
                <tr>
                    <th style="width: 15%;">Tiêu chí</th>
                    <th class="th-orange" style="width: 25%;">1. Vét cạn 3 vòng lặp</th>
                    <th class="th-orange" style="width: 25%;">2. Cộng dồn 2 vòng lặp</th>
                    <th class="th-green" style="width: 35%;">3. Hai con trỏ (Sliding Window)</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td class="td-label">Ý tưởng cốt lõi</td>
                    <td>Duyệt mọi điểm đầu $L$, mọi điểm cuối $R$. Dùng thêm vòng lặp thứ 3 chạy từ $L$ đến $R$ để tính tổng lại từ đầu.</td>
                    <td>Duyệt $L$ và $R$. Khi $R$ tiến lên 1 bước, chỉ cần lấy tổng cũ cộng thêm phần tử mới $A[R]$.</td>
                    <td>Con trỏ $R$ kéo giãn để tăng tổng, con trỏ $L$ co lại để giảm tổng. Tận dụng tính chất: Nếu $A[L..R] \ge K$ thì các đoạn dài hơn chắc chắn $\ge K$.</td>
                </tr>
                <tr>
                    <td class="td-label">Độ phức tạp Thời gian</td>
                    <td>$O(N^3)$<br>(Chạy 3 vòng lặp lồng nhau)</td>
                    <td>$O(N^2)$<br>(Chạy 2 vòng lặp lồng nhau)</td>
                    <td><b>$O(N)$</b><br>(Mỗi phần tử được đưa vào mảng 1 lần và lấy ra tối đa 1 lần)</td>
                </tr>
                <tr>
                    <td class="td-label">Độ phức tạp Bộ nhớ</td>
                    <td>$O(1)$</td>
                    <td>$O(1)$</td>
                    <td>$O(1)$</td>
                </tr>
                <tr>
                    <td class="td-label">Giới hạn qua test</td>
                    <td>Subtask 1 ($N \le 100$)<br>Chạy khoảng $10^6$ phép tính.</td>
                    <td>Subtask 2 ($N \le 1000$)<br>Chạy khoảng $5 \times 10^5$ phép tính.</td>
                    <td><b>Subtask 3 ($N \le 10^5$)</b><br>Tối ưu tuyệt đối, chạy mượt mà trong $0.01$ giây.</td>
                </tr>
                <tr>
                    <td class="td-label">Bài học sư phạm</td>
                    <td>Làm quen với cách tạo ra mọi dãy con liên tiếp. Tuy nhiên, tính toán lặp lại quá nhiều (tổng $A[L..R]$ đã chứa $A[L..R-1]$).</td>
                    <td>Biết cách <b>kế thừa kết quả</b> của bước trước đó để giảm bớt 1 chiều tính toán.</td>
                    <td>Không chỉ kế thừa kết quả tính tổng, mà còn biết cách <b>nhảy cóc (đếm gộp $n - R$)</b> nhờ đánh giá tính chất toán học của dữ liệu đầu vào.</td>
                </tr>
            </tbody>
        </table>
    </div>
</div>