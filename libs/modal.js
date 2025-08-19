let htmlModal = ``;
htmlModal += `
<!-- Button trigger modal -->
<button type="button" id="btnShowModal" class="btn btn-primary btn-lg d-none" data-toggle="modal" data-target="#modelId">
  Launch
</button>
    <!-- Modal -->
    <div class="modal fade" id="modelId" tabindex="-1" role="dialog" aria-labelledby="modelTitleId" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="ModalTitle">Title</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                </div>
                <div class="modal-body" id="ModalBody">
                    Body
                </div>
                <!--
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary">Save</button>
                </div>
                -->
            </div>
        </div>
    </div>
`
document.writeln(htmlModal);

const showModal = (tag) => {
    // console.dir(tag);
    //console.dir(tag.parentNode.parentNode);
    // console.dir(tag.parentNode.parentNode.outerHTML);

    //Tên sản phẩm
    // console.dir(tag.parentNode.parentNode.children[1].children[0].innerHTML)
    let title = tag.parentNode.parentNode.children[1].children[0].innerHTML
    //img
    let html = tag.parentNode.parentNode.children[0].outerHTML
    //Price
    html += `<br>`
    html += tag.parentNode.parentNode.children[1].children[1].outerHTML //Price
    html += tag.parentNode.parentNode.children[1].children[2].outerHTML //Category
    html += "<div class='card-footer d-flex flex-wrap justify-content-between'>"
    html += tag.parentNode.children[1].outerHTML
    html += "</div>"

    ModalTitle.innerHTML = title;
    ModalBody.innerHTML = html;
    document.getElementById("btnShowModal").click();
}