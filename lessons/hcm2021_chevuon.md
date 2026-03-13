## 🌳 Bài: Che mát cho vườn (CHEVUON - HCM 2020-2021)
<br>
<div class="step-card border-blue">
<div class="step-badge bg-blue">Phân tích đề bài</div>

Vườn có kích thước $M \times N$ ($M, N \le 10^3$). Mỗi ô có một cây với chiều cao cho trước.
Tí phải thực hiện 3 công việc:
1. **Quy hoạch cụm:** Chia vườn thành các cụm $2 \times 2$. Nếu ở rìa (phải, dưới) không đủ $2 \times 2$ thì phần dư vẫn tính là 1 cụm. Các cụm được đánh số từ trái qua phải, trên xuống dưới.
2. **Sắp xếp cây:** Lấy TẤT CẢ cây trong vườn, sắp xếp chiều cao giảm dần, sau đó trồng lại vào vườn theo thứ tự từng cụm từ 1 đến hết.
3. **Tính chiều cao lọng:** Mỗi cụm cần 1 lọng che. Chiều cao lọng = Chiều cao cây cao nhất trong cụm + 1.
   - **Cạm bẫy:** Nếu lọng này đè lên lọng khác (do có ô giao nhau ở rìa), lọng nào dựng sau (số thứ tự lớn hơn) sẽ bị kênh lên. Cứ đè lên 1 lọng thì chiều cao tăng thêm 1.
   - **Lưu ý:** Lọng luôn có kích thước CHUẨN $2 \times 2$ dù cụm đó nằm ở rìa vườn bị khuyết.

**Yêu cầu:** In ra vườn cây sau khi sắp xếp, số lượng lọng và danh sách chiều cao lọng.
<div class="important-note">

**📌 Dạng bài:** Xử lý - sắp xếp ma trận
</div>
</div>

<div class="step-card border-orange">
<div class="step-badge bg-orange">Giải pháp: Trực tiếp từng bước (Simulation)</div>

### 💡 Ý tưởng Thuật toán
Với $M, N \le 1000$, tổng số cây là $10^6$. Việc sắp xếp toàn bộ $10^6$ cây tốn khoảng $O(K \log K)$ với $K = M \times N$, hoàn toàn khả thi trong 1 giây. Ta sẽ mô phỏng đúng các bước:

**Bước 1 & 2: Gom mảng và Sắp xếp**
- Đọc ma trận đầu vào, gom tất cả phần tử vào một mảng 1 chiều $A$.
- Sắp xếp mảng $A$ theo thứ tự giảm dần.

**Bước 3: Điền lại ma trận theo cụm**
- Tạo ma trận kết quả $B$ kích thước $M \times N$.
- Duyệt qua các "gốc" của từng cụm. Gốc là ô trên-cùng bên-trái của lọng.
  - Vòng lặp hàng: `r` chạy từ $1$ đến $M$, bước nhảy $2$.
  - Vòng lặp cột: `c` chạy từ $1$ đến $N$, bước nhảy $2$.
- Tại mỗi cụm $(r, c)$, điền lần lượt 4 phần tử lớn nhất còn lại trong mảng $A$ vào các vị trí hợp lệ $(r,c), (r,c+1), (r+1,c), (r+1,c+1)$ (Nếu tọa độ không vượt quá $M, N$).

**Bước 4: Tính chiều cao lọng (Bẫy lọng chồng lên nhau)**
Đây là phần khó nhất. Khi 1 cụm nằm ở rìa phải (ví dụ cột $N$ là cột lẻ), thì lọng $2 \times 2$ của nó sẽ bị "thòi" ra ngoài vườn. Theo đề bài, lọng sẽ "che luôn cả những cây ở hàng liền trên hoặc cột kề bên". Tức là lọng sẽ thụt vào bên trong vườn và **chắc chắn đè lên lọng bên cạnh**.
- **Quy tắc lọng rìa:** Nếu cụm ở rìa làm lọng vượt quá vườn, lọng sẽ tự dịch trái/lên trên để vừa khít vườn (vẫn giữ size $2 \times 2$).
  - Gốc thật sự của lọng: `true_r = MIN(r, M - 1)`, `true_c = MIN(c, N - 1)`.
- **Đếm số lớp lọng đè lên nhau:** Ta dùng một ma trận `SoLop[M][N]` khởi tạo bằng 0.
  - Khi dựng lọng tại `(true_r, true_c)`, chiều cao lọng = (Max chiều cao 4 cây bên dưới) + 1 + (Số lớp bạt đang đè lên vị trí này).
  - Sau khi dựng xong, cộng thêm 1 vào `SoLop` của 4 ô khu vực bạt vừa che.
</div>

<div class="step-card border-green">
<div class="step-badge bg-green">Mã giả thuật toán</div>

<pre class="pseudocode">
<span class="kw">NHẬP</span> <span class="var">M</span>, <span class="var">N</span>
<span class="var">A</span> = []
<span class="kw">LẶP</span> <span class="var">i</span> từ <span class="val">1</span> <span class="kw">ĐẾN</span> <span class="var">M</span>:
    <span class="kw">LẶP</span> <span class="var">j</span> từ <span class="val">1</span> <span class="kw">ĐẾN</span> <span class="var">N</span>:
        <span class="kw">NHẬP</span> <span class="var">val</span>
        <span class="var">A</span>.Them(<span class="var">val</span>)

<span class="var">A</span>.SapXepGiamDan()

<span class="var">B</span> = <span class="fn">MaTran_M_x_N</span>()
<span class="var">SoLop</span> = <span class="fn">MaTran_M_x_N_Toan_0</span>()
<span class="var">idx</span> = <span class="val">0</span>
<span class="var">Longs</span> = []

<span class="com">// Duyệt từng cụm (nhảy cóc 2)</span>
<span class="kw">LẶP</span> <span class="var">r</span> từ <span class="val">1</span> <span class="kw">ĐẾN</span> <span class="var">M</span> <span class="kw">BƯỚC</span> <span class="val">2</span>:
    <span class="kw">LẶP</span> <span class="var">c</span> từ <span class="val">1</span> <span class="kw">ĐẾN</span> <span class="var">N</span> <span class="kw">BƯỚC</span> <span class="val">2</span>:
        
        <span class="com">// Điền cây vào cụm (ưu tiên ô trong vườn)</span>
        <span class="var">max_tree</span> = <span class="val">0</span>
        <span class="kw">LẶP MỖI</span> <span class="var">(dr, dc)</span> <span class="kw">TRONG</span> [(0,0), (0,1), (1,0), (1,1)]:
            <span class="var">nr</span> = <span class="var">r</span> + <span class="var">dr</span>
            <span class="var">nc</span> = <span class="var">c</span> + <span class="var">dc</span>
            <span class="kw">NẾU</span> (<span class="var">nr</span> ≤ <span class="var">M</span> <span class="kw">VÀ</span> <span class="var">nc</span> ≤ <span class="var">N</span>):
                <span class="var">B</span>[<span class="var">nr</span>][<span class="var">nc</span>] = <span class="var">A</span>[<span class="var">idx</span>]
                <span class="var">max_tree</span> = <span class="fn">MAX</span>(<span class="var">max_tree</span>, <span class="var">B</span>[<span class="var">nr</span>][<span class="var">nc</span>])
                <span class="var">idx</span> = <span class="var">idx</span> + <span class="val">1</span>
        
        <span class="com">// Xác định vị trí THẬT của bạt che (luôn 2x2)</span>
        <span class="var">bat_r</span> = <span class="fn">MIN</span>(<span class="var">r</span>, <span class="var">M</span> - <span class="val">1</span>)
        <span class="var">bat_c</span> = <span class="fn">MIN</span>(<span class="var">c</span>, <span class="var">N</span> - <span class="val">1</span>)
        
        <span class="com">// Lớp đè lớn nhất trong khu vực bạt 2x2</span>
        <span class="var">max_lop</span> = <span class="val">0</span>
        <span class="kw">LẶP MỖI</span> <span class="var">(dr, dc)</span> <span class="kw">TRONG</span> [(0,0), (0,1), (1,0), (1,1)]:
            <span class="var">max_lop</span> = <span class="fn">MAX</span>(<span class="var">max_lop</span>, <span class="var">SoLop</span>[<span class="var">bat_r</span> + <span class="var">dr</span>][<span class="var">bat_c</span> + <span class="var">dc</span>])
            
        <span class="com">// Tính lọng</span>
        <span class="var">chieu_cao_long</span> = <span class="var">max_tree</span> + <span class="val">1</span> + <span class="var">max_lop</span>
        <span class="var">Longs</span>.Them(<span class="var">chieu_cao_long</span>)
        
        <span class="com">// Thêm 1 lớp bạt lên ma trận SoLop</span>
        <span class="kw">LẶP MỖI</span> <span class="var">(dr, dc)</span> <span class="kw">TRONG</span> [(0,0), (0,1), (1,0), (1,1)]:
            <span class="var">SoLop</span>[<span class="var">bat_r</span> + <span class="var">dr</span>][<span class="var">bat_c</span> + <span class="var">dc</span>] = <span class="var">max_lop</span> + <span class="val">1</span>

<span class="com">// In kết quả...</span>
</pre>
</div>