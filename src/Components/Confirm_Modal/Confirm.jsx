import React from "react";

const Confirm = ({ handleClose, handleLogout }) => {
  const handleCloseModal = (e) => {
    e.preventDefault();
    handleClose();
  };
  return (
    <dialog className="modal " open>
      <div className="modal-box bg-[#282e33]">
        <div className="flex flex-col gap-5">
          <p>Are you sure you want to logout ?</p>
          <div className="flex justify-between items-center h-16">
            <button
              onClick={handleCloseModal}
              className="btn w-[40%] bg-[#bb3127] text-white border-[#bb3127] outline-none hover:bg-[#bb3127] hover:border-[#bb3127]"
            >
              Cancel
            </button>
            <button onClick={handleLogout} className="btn btn-accent w-[40%]">
              Confirm
            </button>
          </div>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={handleCloseModal}>close</button>
      </form>
    </dialog>
  );
};

export default Confirm;
