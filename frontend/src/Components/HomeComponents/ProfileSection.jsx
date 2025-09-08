import React from 'react';
import { TbCircleDashed } from 'react-icons/tb';
import { BiCommentDetail } from 'react-icons/bi';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { Menu, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ProfileSection = ({
  auth,
  isProfile,
  isGroup,
  handleNavigate,
  handleClick,
  handleCreateGroup,
  handleLogout,
  handleClose,
  open,
  anchorEl,
}) => {
  const navigate = useNavigate();

  return (
    <div className="p-4 border-b border-white/10">
      <div className="flex justify-between items-center">
        <div 
          onClick={handleNavigate} 
          className="flex items-center space-x-3 cursor-pointer hover:bg-white/10 p-2 rounded-lg transition-all group"
        >
          <div className="relative">
            <img
              className="rounded-full w-12 h-12 border-2 border-white/20 shadow-lg group-hover:scale-105 transition-transform"
              src={
                auth.reqUser?.profile ||
                "https://media.istockphoto.com/id/521977679/photo/silhouette-of-adult-woman.webp?b=1&s=170667a&w=0&k=20&c=wpJ0QJYXdbLx24H5LK08xSgiQ3zNkCAD2W3F74qlUL0="
              }
              alt="profile"
            />
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
          </div>
          <div>
            <p className="text-white font-semibold text-lg">{auth.reqUser?.name}</p>
            <p className="text-white/60 text-sm">Online</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigate("/status")}
            className="p-2 hover:bg-white/10 rounded-full transition-all hover:scale-110 text-white/70 hover:text-white"
          >
            <TbCircleDashed className="text-xl" />
          </button>
          
          <button className="p-2 hover:bg-white/10 rounded-full transition-all hover:scale-110 text-white/70 hover:text-white">
            <BiCommentDetail className="text-xl" />
          </button>
          
          <button
            id="basic-button"
            aria-controls={open ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
            className="p-2 hover:bg-white/10 rounded-full transition-all hover:scale-110 text-white/70 hover:text-white"
          >
            <BsThreeDotsVertical className="text-xl" />
          </button>
          
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
            PaperProps={{
              style: {
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                color: 'white',
              },
            }}
          >
            <MenuItem 
              onClick={handleNavigate}
              sx={{ 
                '&:hover': { 
                  backgroundColor: 'rgba(255, 255, 255, 0.1)' 
                } 
              }}
            >
              Profile
            </MenuItem>
            <MenuItem 
              onClick={handleCreateGroup}
              sx={{ 
                '&:hover': { 
                  backgroundColor: 'rgba(255, 255, 255, 0.1)' 
                } 
              }}
            >
              Create Group
            </MenuItem>
            <MenuItem 
              onClick={handleLogout}
              sx={{ 
                '&:hover': { 
                  backgroundColor: 'rgba(255, 255, 255, 0.1)' 
                } 
              }}
            >
              Logout
            </MenuItem>
          </Menu>
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;
