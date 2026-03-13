## 🏔️ Bài: Đỉnh đồi (TOP - HCM 2016-2017)
<br>
<div class="step-card border-blue">
<div class="step-badge bg-blue">Phân tích đề bài</div>

Cho một bản đồ kích thước $N \times M$ ($1 < N, M \le 1000$), mỗi ô $(i, j)$ có độ cao $H_{ij}$.

**Yêu cầu:** Đếm số lượng đỉnh đồi trên bản đồ.

**Định nghĩa Đỉnh đồi:**
1. Là một vùng gồm **1 hoặc nhiều ô nằm kề nhau** có **cùng độ cao**.
2. Kề nhau theo **8 hướng** (chênh lệch tọa độ X và Y không quá 1).
3. Vùng này phải được bao quanh hoàn toàn bởi cạnh của bản đồ (ra ngoài rìa) hoặc bởi các ô có **độ cao thấp hơn hẳn**. Tức là không có ô nào kề với vùng này mà có độ cao lớn hơn vùng đó.
<div class="important-note">

**📌 Dạng bài:** DSF hoặc BFS  
</div>
</div>

<div class="step-card border-orange">
<div class="step-badge bg-orange">Cách 1: Loang DFS (Tìm kiếm theo chiều sâu)</div>

### 💡 Ý tưởng
Ta dùng Đệ quy (hoặc Ngăn xếp - Stack) để đi sâu vào tận cùng của mạng lưới cao nguyên trước khi quay lui. 

**Ưu điểm:** DFS thường có code rất ngắn gọn, dễ viết và ít bị lỗi lặt vặt.

**Nhược điểm:** Nếu vùng cao nguyên quá rộng lớn, đệ quy gọi lồng nhau liên tục có thể gây lỗi Tràn bộ nhớ (Stack Overflow) trong một số trình chấm.

**Mã giả C++:**
<pre class="pseudocode">
<span class="kw">bool</span> <span class="var">is_top</span>;
<span class="kw">void</span> <span class="fn">DFS</span>(<span class="kw">int</span> <span class="var">u</span>, <span class="kw">int</span> <span class="var">v</span>, <span class="kw">int</span> <span class="var">h</span>) {
    <span class="var">Visited[u][v]</span> = <span class="kw">true</span>;
    <span class="kw">LẶP MỖI</span> ô <span class="var">(nr, nc)</span> kề <span class="var">(u, v)</span> trong 8 hướng:
        <span class="kw">NẾU</span> (<span class="var">MaTran[nr][nc]</span> > <span class="var">h</span>) <span class="var">is_top</span> = <span class="kw">false</span>;
        <span class="kw">NẾU</span> (<span class="var">MaTran[nr][nc]</span> == <span class="var">h</span> <span class="kw">VÀ CHƯA THĂM</span>) <span class="fn">DFS</span>(<span class="var">nr</span>, <span class="var">nc</span>, <span class="var">h</span>);
}

<span class="com">// Trong hàm main:</span>
<span class="kw">LẶP</span> <span class="var">i</span> từ <span class="val">1</span> <span class="kw">ĐẾN</span> <span class="var">N</span>, <span class="var">j</span> từ <span class="val">1</span> <span class="kw">ĐẾN</span> <span class="var">M</span>:
    <span class="kw">NẾU</span> (<span class="kw">CHƯA THĂM</span> <span class="var">(i, j)</span>):
        <span class="var">is_top</span> = <span class="kw">true</span>;
        <span class="fn">DFS</span>(<span class="var">i</span>, <span class="var">j</span>, <span class="var">MaTran[i][j]</span>);
        <span class="kw">NẾU</span> (<span class="var">is_top</span>) <span class="var">so_dinh_doi</span>++;
</pre>
</div>

<div class="step-card border-green">
<div class="step-badge bg-green">Cách 2: Loang BFS (Tìm kiếm theo chiều rộng)</div>

### 💡 Ý tưởng
Ta dùng thuật toán BFS kết hợp Hàng đợi (Queue) để tìm toàn bộ vùng cao nguyên có cùng độ cao, đồng thời kiểm tra "biên giới" của cao nguyên đó.

1. Khởi tạo `Visited[N][M] = false`.
2. Duyệt từng ô $(i, j)$. Nếu chưa thăm, giả sử vùng này là đỉnh đồi (`is_top = true`).
3. Đẩy $(i, j)$ vào Queue và bắt đầu loang:
   - Rút ô $u$ ra khỏi Queue, xét 8 ô $v$ xung quanh.
   - Nếu $H_v > H_u$: Cao nguyên này bị núi che khuất $\rightarrow$ `is_top = false`.
   - Nếu $H_v == H_u$ và chưa thăm: Đánh dấu đã thăm, đẩy $v$ vào Queue để loang tiếp.
4. Nếu sau khi loang xong `is_top` vẫn `true`, tăng biến đếm đỉnh đồi.

**Mã giả C++:**
<pre class="pseudocode">
<span class="var">so_dinh_doi</span> = <span class="val">0</span>;
<span class="kw">LẶP</span> <span class="var">i</span> từ <span class="val">1</span> <span class="kw">ĐẾN</span> <span class="var">N</span>:
    <span class="kw">LẶP</span> <span class="var">j</span> từ <span class="val">1</span> <span class="kw">ĐẾN</span> <span class="var">M</span>:
        <span class="kw">NẾU</span> (<span class="var">Visited[i][j]</span> == <span class="kw">false</span>) <span class="kw">THÌ</span>:
            <span class="var">is_top</span> = <span class="kw">true</span>;
            <span class="var">H</span> = <span class="var">MaTran[i][j]</span>;
            <span class="var">Q</span> = <span class="fn">Tao_Hang_Doi_Rong</span>();
            
            <span class="var">Q</span>.Push((<span class="var">i</span>, <span class="var">j</span>));
            <span class="var">Visited[i][j]</span> = <span class="kw">true</span>;
            
            <span class="com">// Bắt đầu loang BFS</span>
            <span class="kw">TRONG KHI</span> (<span class="var">Q</span> <span class="kw">không rỗng</span>):
                <span class="var">u</span> = <span class="var">Q</span>.Pop_Front(); <span class="com">// Lấy ô đầu tiên ra khỏi hàng đợi</span>
                
                <span class="kw">LẶP MỖI</span> ô <span class="var">v</span> kề <span class="var">u</span> (trong 8 hướng):
                    <span class="kw">NẾU</span> (<span class="var">MaTran[v]</span> > <span class="var">H</span>) <span class="kw">THÌ</span>:
                        <span class="var">is_top</span> = <span class="kw">false</span>; <span class="com">// Bị núi cao hơn che khuất</span>
                    <span class="kw">NẾU</span> (<span class="var">MaTran[v]</span> == <span class="var">H</span> <span class="kw">VÀ</span> <span class="var">Visited[v]</span> == <span class="kw">false</span>) <span class="kw">THÌ</span>:
                        <span class="var">Visited[v]</span> = <span class="kw">true</span>;
                        <span class="var">Q</span>.Push(<span class="var">v</span>); <span class="com">// Đưa vào hàng đợi để loang tiếp</span>
            
            <span class="com">// Sau khi loang hết vùng, kiểm tra trạng thái</span>
            <span class="kw">NẾU</span> (<span class="var">is_top</span> == <span class="kw">true</span>) <span class="kw">THÌ</span>:
                <span class="var">so_dinh_doi</span> = <span class="var">so_dinh_doi</span> + <span class="val">1</span>;

<span class="kw">XUẤT</span> <span class="var">so_dinh_doi</span>;
</pre>
</div>

<div class="step-card border-red">
<div class="step-badge bg-red">Phương pháp sai lầm: Duyệt ô độc lập</div>

Nhiều học sinh sẽ dùng 2 vòng lặp `for` duyệt qua từng ô $(i, j)$, kiểm tra xem $H_{ij}$ có lớn hơn hoặc bằng cả 8 ô xung quanh hay không. 
- **Lỗi sai:** Nếu đỉnh đồi là một "cao nguyên" bằng phẳng gồm nhiều ô, thuật toán ngây thơ này sẽ đếm mỗi ô là 1 đỉnh đồi (bị đếm trùng). Hơn nữa, một cao nguyên có thể có một mép tiếp xúc với núi cao hơn, làm cả cao nguyên đó bị loại, nhưng nếu chỉ duyệt từng ô thì sẽ không phát hiện ra.
</div>

<div class="step-card border-purple">
    <div class="step-badge bg-purple">Bảng So sánh 3 Phương pháp</div>
    
<div class="table-wrapper">
        <table class="algo-table">
            <thead>
                <tr>
                    <th style="width: 20%;">Tiêu chí</th>
                    <th class="th-orange" style="width: 25%;">Cách 1: Duyệt ô độc lập</th>
                    <th class="th-green" style="width: 27%;">Cách 2: Loang BFS</th>
                    <th style="color:#d946ef; width: 28%;">Cách 3: Loang DFS</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td class="td-label">Ý tưởng lõi</td>
                    <td>Xét tính chất từng ô 1x1.</td>
                    <td>Nhóm các ô thành cụm, lan tỏa theo từng lớp (dùng Queue).</td>
                    <td>Nhóm các ô thành cụm, luồn lách đi sâu tới cùng (dùng Đệ quy/Stack).</td>
                </tr>
                <tr>
                    <td class="td-label">Kết quả trên vùng phẳng</td>
                    <td class="td-warning"><b>SAI.</b> Đếm lặp hoặc bỏ sót.</td>
                    <td class="td-optimal"><b>CHÍNH XÁC.</b></td>
                    <td class="td-optimal"><b>CHÍNH XÁC.</b></td>
                </tr>
                <tr>
                    <td class="td-label">Độ khó cài đặt</td>
                    <td>Rất dễ</td>
                    <td>Hơi dài (cần viết vòng lặp `while` và mảng Queue).</td>
                    <td>Rất ngắn gọn (chỉ 1 hàm đệ quy vài dòng).</td>
                </tr>
                <tr>
                    <td class="td-label">Rủi ro hệ thống</td>
                    <td>Không có rủi ro hệ thống, nhưng sai thuật toán.</td>
                    <td>Rất an toàn. Mảng Queue dùng bộ nhớ Heap nên không lo tràn.</td>
                    <td><b style="color:#c2410c;">Cẩn thận Stack Overflow</b> nếu bản đồ $1000 \times 1000$ toàn số bằng nhau (đệ quy sâu $10^6$ lần).</td>
                </tr>
            </tbody>
        </table>
    </div>
</div>