## 💺 Bài: Xếp chỗ (PLACE - HCM 2018-2019)
<br>
<div class="step-card border-blue">
<div class="step-badge bg-blue">Phân tích đề bài</div>

Có $N$ nhóm học sinh ($1 \le N \le 10^7$). Mỗi nhóm có $s_i$ học sinh ($1 \le s_i \le 4$).
Nhà trường cần chuẩn bị các bàn trống, mỗi bàn chứa tối đa 4 học sinh.

**Điều kiện:** Không có nhóm nào bị chia ra ngồi ở 2 bàn khác nhau (các thành viên cùng nhóm phải ngồi chung 1 bàn).

**Yêu cầu:** Tìm số lượng bàn tối thiểu cần chuẩn bị.
<div class="important-note">

**📌 Dạng bài:** Đếm phân phối - tham lam
</div>
</div>

<div class="step-card border-orange">
<div class="step-badge bg-orange">Giải pháp: Đếm phân phối & Tham lam (Greedy)</div>

### 💡 Ý tưởng Tối ưu
Vì $N$ có thể lên tới $10^7$, ta không thể dùng thuật toán có độ phức tạp $O(N \log N)$ (như sắp xếp) hay $O(N^2)$. Ta cần thuật toán $O(N)$.
Rất may mắn, quy mô của mỗi nhóm chỉ từ 1 đến 4 người. Ta sẽ đếm xem có bao nhiêu nhóm 1 người (`c1`), nhóm 2 người (`c2`), nhóm 3 người (`c3`) và nhóm 4 người (`c4`). Sau đó, áp dụng chiến thuật ghép bàn tham lam:

1. **Nhóm 4 người (`c4`):** Trọn vẹn 1 bàn. Không thể ghép thêm ai. Số bàn cần thêm là `c4`.
2. **Nhóm 3 người (`c3`):** Mỗi nhóm 3 người chiếm 1 bàn và **dư đúng 1 chỗ trống**. Để tối ưu, ta ưu tiên gọi các nhóm 1 người (`c1`) vào lấp chỗ trống này.
   - Số bàn cần thêm là `c3`.
   - Số nhóm 1 người còn lại: `c1 = MAX(0, c1 - c3)`.
3. **Nhóm 2 người (`c2`):** - Cứ 2 nhóm 2 người thì ghép vừa khít 1 bàn. Số bàn cần thêm: `c2 / 2`.
   - Nếu lẻ 1 nhóm 2 người (`c2 % 2 != 0`), nhóm này chiếm 1 bàn mới và **dư 2 chỗ trống**. Ta ưu tiên gọi tối đa 2 nhóm 1 người vào lấp chỗ.
     - Số bàn cần thêm: `+1`.
     - Số nhóm 1 người còn lại: `c1 = MAX(0, c1 - 2)`.
4. **Nhóm 1 người (`c1`):** Lúc này chỉ còn toàn các nhóm 1 người "bơ vơ". Ta cứ gom 4 nhóm vào 1 bàn.
   - Số bàn cần thêm: `CEIL(c1 / 4)` (tức là làm tròn lên của phép chia 4, công thức số nguyên: `(c1 + 3) / 4`).

Chiến thuật này lấp đầy các khoảng trống một cách khít nhất có thể, đảm bảo số bàn luôn là tối thiểu!
</div>

<div class="step-card border-green">
<div class="step-badge bg-green">Mã giả thuật toán</div>

<pre class="pseudocode">
<span class="kw">NHẬP</span> <span class="var">N</span>
<span class="var">c1</span> = <span class="val">0</span>, <span class="var">c2</span> = <span class="val">0</span>, <span class="var">c3</span> = <span class="val">0</span>, <span class="var">c4</span> = <span class="val">0</span>

<span class="com">// Đếm phân phối (O(N))</span>
<span class="kw">LẶP</span> <span class="var">i</span> từ <span class="val">1</span> <span class="kw">ĐẾN</span> <span class="var">N</span>:
    <span class="kw">NHẬP</span> <span class="var">s</span>
    <span class="kw">NẾU</span> (<span class="var">s</span> == <span class="val">1</span>) <span class="kw">THÌ</span> <span class="var">c1</span> = <span class="var">c1</span> + <span class="val">1</span>
    <span class="kw">NẾU</span> (<span class="var">s</span> == <span class="val">2</span>) <span class="kw">THÌ</span> <span class="var">c2</span> = <span class="var">c2</span> + <span class="val">1</span>
    <span class="kw">NẾU</span> (<span class="var">s</span> == <span class="val">3</span>) <span class="kw">THÌ</span> <span class="var">c3</span> = <span class="var">c3</span> + <span class="val">1</span>
    <span class="kw">NẾU</span> (<span class="var">s</span> == <span class="val">4</span>) <span class="kw">THÌ</span> <span class="var">c4</span> = <span class="var">c4</span> + <span class="val">1</span>

<span class="var">so_ban</span> = <span class="var">c4</span>

<span class="com">// Ghép nhóm 3 và nhóm 1</span>
<span class="var">so_ban</span> = <span class="var">so_ban</span> + <span class="var">c3</span>
<span class="var">c1</span> = <span class="fn">MAX</span>(<span class="val">0</span>, <span class="var">c1</span> - <span class="var">c3</span>)

<span class="com">// Ghép nhóm 2</span>
<span class="var">so_ban</span> = <span class="var">so_ban</span> + (<span class="var">c2</span> / <span class="val">2</span>)
<span class="kw">NẾU</span> (<span class="var">c2</span> % <span class="val">2</span> ≠ <span class="val">0</span>) <span class="kw">THÌ</span>:
    <span class="var">so_ban</span> = <span class="var">so_ban</span> + <span class="val">1</span>
    <span class="var">c1</span> = <span class="fn">MAX</span>(<span class="val">0</span>, <span class="var">c1</span> - <span class="val">2</span>)

<span class="com">// Gom nhóm 1 còn lại</span>
<span class="var">so_ban</span> = <span class="var">so_ban</span> + (<span class="var">c1</span> + <span class="val">3</span>) / <span class="val">4</span>

<span class="kw">XUẤT</span> <span class="var">so_ban</span>
</pre>
</div>

<div class="step-card border-purple">
    <div class="step-badge bg-purple">Bảng Đánh giá Thuật toán</div>
    
<div class="table-wrapper">
        <table class="algo-table">
            <thead>
                <tr>
                    <th style="width: 25%;">Đặc điểm</th>
                    <th class="th-green" style="width: 75%;">Tham lam đếm phân phối</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td class="td-label">Độ phức tạp Thời gian</td>
                    <td>$O(N)$ do chỉ cần 1 vòng lặp duy nhất để đọc dữ liệu và đếm. Phần tính toán sau đó chỉ tốn $O(1)$. Hoàn hảo vượt qua giới hạn $N = 10^7$ trong thời gian chưa tới 0.1 giây.</td>
                </tr>
                <tr>
                    <td class="td-label">Độ phức tạp Bộ nhớ</td>
                    <td>$O(1)$. Không cần lưu mảng dữ liệu đầu vào. Đọc số nào xử lý đếm số đó $\rightarrow$ Tiết kiệm tối đa RAM.</td>
                </tr>
            </tbody>
        </table>
    </div>
</div>