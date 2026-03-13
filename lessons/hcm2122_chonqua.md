## 🎁 Bài 3: Chọn quà (CHONQUA - HCM 2021-2022)
<br>
<div class="step-card border-blue">
<div class="step-badge bg-blue">Phân tích đề bài (Bóc tách cạm bẫy)</div>

Cho một lưới kích thước $D \times R$ ($3 \le D, R \le 1000$).
Ta dùng một khung vợt kích thước $K \times K$ đặt lên lưới.

**Điều kiện ăn điểm:** Chỉ những món quà nằm **HOÀN TOÀN BÊN TRONG** 4 cạnh của vợt mới được tính. Quà nằm trên viền vợt bị bỏ đi.

**Giải mã Hình học:**
- Khung vợt $K \times K$ sẽ chiếm từ hàng $i$ đến hàng $i + K - 1$, và từ cột $j$ đến cột $j + K - 1$.
- Phần "viền" chính là hàng $i$, hàng $i+K-1$, cột $j$, cột $j+K-1$.
- Phần **"lõi" (bên trong)** bắt đầu từ hàng $i+1$ đến $i+K-2$, và từ cột $j+1$ đến $j+K-2$.
$\Rightarrow$ Kích thước thực sự của khu vực hốt quà là một hình vuông nhỏ hơn: **$(K - 2) \times (K - 2)$**.

**Ví dụ đề bài:** Lưới $7 \times 6$, Vợt $K = 4$. Lõi hốt quà thực chất chỉ là một hình vuông $(4-2) \times (4-2) = 2 \times 2$. Ta chỉ cần rà quét xem hình vuông $2 \times 2$ nào trên bản đồ chứa nhiều dấu `*` nhất!
<div class="important-note">

**📌 Dạng bài:** Ma trận cộng dồn
</div>
</div>

<div class="step-card border-orange">
<div class="step-badge bg-orange">Cách 1: Vét cạn (Subtask 1: D, R ≤ 100)</div>

### 💡 Ý tưởng
- Đặt góc trên bên trái của vùng "lõi" tại mọi tọa độ $(r, c)$.
- Dùng 2 vòng lặp lồng nhau quét qua hình vuông kích thước $(K-2) \times (K-2)$ để đếm số dấu `*`.

<pre class="pseudocode">
<span class="kw">NHẬP</span> <span class="var">D</span>, <span class="var">R</span>, <span class="var">K</span>
<span class="var">A</span> = <span class="fn">MaTran</span>(D+1, R+1)

<span class="kw">LẶP</span> <span class="var">i</span> từ <span class="val">1</span> <span class="kw">ĐẾN</span> <span class="var">D</span>:
    <span class="kw">LẶP</span> <span class="var">j</span> từ <span class="val">1</span> <span class="kw">ĐẾN</span> <span class="var">R</span>:
        <span class="kw">NHẬP</span> <span class="var">A</span>[<span class="var">i</span>][<span class="var">j</span>]

<span class="var">Max_Qua</span> = <span class="val">0</span>

<span class="com">// i, j là tọa độ góc trên trái của khung vợt</span>
<span class="kw">LẶP</span> <span class="var">i</span> từ <span class="val">1</span> <span class="kw">ĐẾN</span> <span class="var">D</span> - <span class="var">K</span> + <span class="val">1</span>:
    <span class="kw">LẶP</span> <span class="var">j</span> từ <span class="val">1</span> <span class="kw">ĐẾN</span> <span class="var">R</span> - <span class="var">K</span> + <span class="val">1</span>:
        <span class="var">dem_qua</span> = <span class="val">0</span>
        
        <span class="com">// r, c là tọa độ quét phần LÕI bên trong khung vợt</span>
        <span class="kw">LẶP</span> <span class="var">r</span> từ <span class="var">i</span> + <span class="val">1</span> <span class="kw">ĐẾN</span> <span class="var">i</span> + <span class="var">K</span> - <span class="val">2</span>:
            <span class="kw">LẶP</span> <span class="var">c</span> từ <span class="var">j</span> + <span class="val">1</span> <span class="kw">ĐẾN</span> <span class="var">j</span> + <span class="var">K</span> - <span class="val">2</span>:
                <span class="kw">NẾU</span> (<span class="var">A</span>[<span class="var">r</span>][<span class="var">c</span>] == <span class="str">'*'</span>) <span class="kw">THÌ</span>:
                    <span class="var">dem_qua</span> = <span class="var">dem_qua</span> + <span class="val">1</span>
                    
        <span class="var">Max_Qua</span> = <span class="fn">MAX</span>(<span class="var">Max_Qua</span>, <span class="var">dem_qua</span>)

<span class="kw">XUẤT</span> <span class="var">Max_Qua</span>
</pre>

**Đánh giá:** Mã giả trên sử dụng 4 vòng lặp lồng nhau. Độ phức tạp là $O(D \times R \times K^2)$. 
- Với Subtask 1 ($D, R \le 100$), số phép tính lớn nhất khoảng $100 \times 100 \times 100^2 = 10^8$ (vẫn chạy kịp trong 1 giây).
- Với $D, R = 1000$, số phép tính lên tới $1000 \times 1000 \times 1000^2 = 10^{12} \rightarrow$ Chắc chắn TLE.
</div>

<div class="step-card border-green">
<div class="step-badge bg-green">Cách 2: Mảng cộng dồn 2 Chiều (Tối ưu 100% Điểm)</div>

### 💡 Ý tưởng Tối ưu (2D Prefix Sum)
Để tính tổng các dấu `*` (quy ước `*` là 1, `.` là 0) trong một vùng hình chữ nhật bất kỳ chỉ mất $O(1)$ thời gian, ta sử dụng Mảng cộng dồn 2 chiều $P$.
- $P[i][j]$ lưu tổng số quà trong hcn từ góc $(1,1)$ đến $(i,j)$.
- **Công thức xây dựng:** $P[i][j] = A[i][j] + P[i-1][j] + P[i][j-1] - P[i-1][j-1]$
- **Công thức truy vấn:** Tổng quà trong hcn từ $(r1, c1)$ đến $(r2, c2)$ là:
  $Sum = P[r2][c2] - P[r1-1][c2] - P[r2][c1-1] + P[r1-1][c1-1]$

**Áp dụng vào khung vợt:**
- Góc trên cùng bên trái của VỢT là $(i, j)$.
- Tọa độ 2 góc của phần LÕI sẽ là: $(r1, c1) = (i+1, j+1)$ và $(r2, c2) = (i+K-2, j+K-2)$.
- Thay vào công thức, tổng quà trong lõi vợt = **$P[i+K-2][j+K-2] - P[i][j+K-2] - P[i+K-2][j] + P[i][j]$**. Quá đẹp và không lo bị lỗi Off-by-one (+1/-1)!

<pre class="pseudocode">
<span class="kw">NHẬP</span> <span class="var">D</span>, <span class="var">R</span>, <span class="var">K</span>
<span class="var">A</span> = <span class="fn">MaTran</span>(D+1, R+1, <span class="val">0</span>)
<span class="var">P</span> = <span class="fn">MaTran</span>(D+1, R+1, <span class="val">0</span>)

<span class="com">// Chuyển đổi và Xây dựng Mảng cộng dồn</span>
<span class="kw">LẶP</span> <span class="var">i</span> từ <span class="val">1</span> <span class="kw">ĐẾN</span> <span class="var">D</span>:
    <span class="kw">LẶP</span> <span class="var">j</span> từ <span class="val">1</span> <span class="kw">ĐẾN</span> <span class="var">R</span>:
        <span class="kw">NHẬP</span> <span class="var">ky_tu</span>
        <span class="kw">NẾU</span> (<span class="var">ky_tu</span> == <span class="str">'*'</span>) <span class="kw">THÌ</span> <span class="var">A</span>[<span class="var">i</span>][<span class="var">j</span>] = <span class="val">1</span>
        
        <span class="var">P</span>[<span class="var">i</span>][<span class="var">j</span>] = <span class="var">A</span>[<span class="var">i</span>][<span class="var">j</span>] + <span class="var">P</span>[<span class="var">i</span>-<span class="val">1</span>][<span class="var">j</span>] + <span class="var">P</span>[<span class="var">i</span>][<span class="var">j</span>-<span class="val">1</span>] - <span class="var">P</span>[<span class="var">i</span>-<span class="val">1</span>][<span class="var">j</span>-<span class="val">1</span>]

<span class="var">Max_Qua</span> = <span class="val">0</span>

<span class="com">// Quét Vợt: Góc trái trên của Vợt chạy từ (1,1) đến (D-K+1, R-K+1)</span>
<span class="kw">LẶP</span> <span class="var">i</span> từ <span class="val">1</span> <span class="kw">ĐẾN</span> <span class="var">D</span> - <span class="var">K</span> + <span class="val">1</span>:
    <span class="kw">LẶP</span> <span class="var">j</span> từ <span class="val">1</span> <span class="kw">ĐẾN</span> <span class="var">R</span> - <span class="var">K</span> + <span class="val">1</span>:
        <span class="com">// Tọa độ góc dưới phải của phần LÕI</span>
        <span class="var">r2</span> = <span class="var">i</span> + <span class="var">K</span> - <span class="val">2</span>
        <span class="var">c2</span> = <span class="var">j</span> + <span class="var">K</span> - <span class="val">2</span>
        
        <span class="var">Sum</span> = <span class="var">P</span>[<span class="var">r2</span>][<span class="var">c2</span>] - <span class="var">P</span>[<span class="var">i</span>][<span class="var">c2</span>] - <span class="var">P</span>[<span class="var">r2</span>][<span class="var">j</span>] + <span class="var">P</span>[<span class="var">i</span>][<span class="var">j</span>]
        <span class="var">Max_Qua</span> = <span class="fn">MAX</span>(<span class="var">Max_Qua</span>, <span class="var">Sum</span>)

<span class="kw">XUẤT</span> <span class="var">Max_Qua</span>
</pre>
</div>

<div class="step-card border-purple">
    <div class="step-badge bg-purple">Bảng Đánh giá Thuật toán</div>
    
    <div class="table-wrapper">
        <table class="algo-table">
            <thead>
                <tr>
                    <th style="width: 25%;">Đặc điểm</th>
                    <th class="th-green" style="width: 75%;">Mảng cộng dồn 2 Chiều</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td class="td-label">Độ phức tạp Thời gian</td>
                    <td>$O(D \times R)$. Lập bảng mất $O(D \times R)$, duyệt tọa độ vợt mất tối đa $O(D \times R)$, tính tổng O(1). Tổng phép tính $\approx 2 \times 10^6$, mượt mà qua giới hạn 1 giây.</td>
                </tr>
                <tr>
                    <td class="td-label">Tinh hoa Toán học</td>
                    <td>Sử dụng nguyên lý Bù trừ (Inclusion-Exclusion Principle) để tính tổng hcn. Nếu học sinh chưa từng học, đây là bài tốt nhất để dạy mảng cộng dồn 2D.</td>
                </tr>
            </tbody>
        </table>
    </div>
</div>