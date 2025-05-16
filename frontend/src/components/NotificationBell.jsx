import React, { useState, useEffect, useRef } from 'react';
import { FaBell, FaHeart, FaComment, FaUserPlus } from 'react-icons/fa';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

const NotificationBell = () => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showDropdown, setShowDropdown] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const dropdownRef = useRef(null);
    const currentUser = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (currentUser) {
            fetchUnreadCount();
            const interval = setInterval(fetchUnreadCount, 10000); // Check every 10 seconds
            return () => clearInterval(interval);
        }
    }, [currentUser]);

    const fetchUnreadCount = async () => {
        if (!currentUser) return;

        try {
            setError(null);
            const response = await fetch(`http://localhost:8070/api/notifications/count/${currentUser.id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch notification count');
            }
            const data = await response.json();
            setUnreadCount(data.count);
        } catch (error) {
            console.error('Error fetching notification count:', error);
            setError('Failed to fetch notifications');
        }
    };

    const fetchNotifications = async () => {
        if (!currentUser) return;

        setIsLoading(true);
        try {
            setError(null);
            const response = await fetch(`http://localhost:8070/api/notifications/${currentUser.id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch notifications');
            }
            const data = await response.json();
            setNotifications(data);
        } catch (error) {
            console.error('Error fetching notifications:', error);
            setError('Failed to fetch notifications');
        } finally {
            setIsLoading(false);
        }
    };

    const handleBellClick = async () => {
        setShowDropdown(!showDropdown);
        if (!showDropdown) {
            await fetchNotifications();
        }
    };

    const markAsRead = async (notificationId) => {
        try {
            setError(null);
            const response = await fetch(`http://localhost:8070/api/notifications/${notificationId}/read`, {
                method: 'POST'
            });
            if (!response.ok) {
                throw new Error('Failed to mark notification as read');
            }
            await fetchUnreadCount();
            setNotifications(notifications.map(notif =>
                notif.id === notificationId ? { ...notif, isRead: true } : notif
            ));
        } catch (error) {
            console.error('Error marking notification as read:', error);
            setError('Failed to mark notification as read');
        }
    };

    const markAllAsRead = async () => {
        if (!currentUser) return;

        try {
            setError(null);
            const response = await fetch(`http://localhost:8070/api/notifications/${currentUser.id}/read-all`, {
                method: 'POST'
            });
            if (!response.ok) {
                throw new Error('Failed to mark all notifications as read');
            }
            setUnreadCount(0);
            setNotifications(notifications.map(notif => ({ ...notif, isRead: true })));
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
            setError('Failed to mark all notifications as read');
        }
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'LIKE':
                return <FaHeart className="text-red-500" />;
            case 'COMMENT':
                return <FaComment className="text-blue-500" />;
            case 'FOLLOW':
                return <FaUserPlus className="text-green-500" />;
            default:
                return <FaBell className="text-gray-500" />;
        }
    };

    const getNotificationContent = (notification) => {
        let actionText;
        switch (notification.type) {
            case 'LIKE':
                actionText = 'liked your post';
                break;
            case 'COMMENT':
                actionText = 'commented on your post';
                break;
            case 'FOLLOW':
                actionText = 'started following you';
                break;
            default:
                actionText = 'interacted with you';
        }

        return (
            <div className="flex flex-col">
                <div className="flex items-center gap-2 text-base">
                    <span className="font-semibold text-blue-900">{notification.senderName}</span>
                    <span className="text-blue-800 font-medium">{actionText}</span>
                </div>
                {notification.type !== 'FOLLOW' && notification.postId && (
                    <Link
                        to={`/post/${notification.postId}`}
                        className="mt-2 text-sm text-blue-600 hover:text-blue-800 hover:underline font-medium flex items-center gap-1"
                    >
                        View post
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </Link>
                )}
            </div>
        );
    };

    if (!currentUser) return null;

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={handleBellClick}
                className="relative p-2 rounded-full hover:bg-gray-700 transition-colors"
            >
                <FaBell size={20} className="text-white" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
            {unreadCount}
          </span>
                )}
            </button>

            {showDropdown && (
                <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl overflow-hidden z-50 border border-gray-200">
                    <div className="p-4 bg-blue-50 border-b border-blue-100 flex justify-between items-center">
                        <h3 className="font-semibold text-blue-900 text-lg">Notifications</h3>
                        {notifications.some(n => !n.isRead) && (
                            <button
                                onClick={markAllAsRead}
                                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                            >
                                Mark all as read
                            </button>
                        )}
                    </div>

                    <div className="max-h-[80vh] overflow-y-auto">
                        {isLoading ? (
                            <div className="p-6 text-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-3 border-blue-500 border-t-transparent mx-auto"></div>
                            </div>
                        ) : error ? (
                            <div className="p-4 text-center text-red-500 font-medium">
                                {error}
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="p-6 text-center text-gray-500 font-medium">
                                No notifications yet
                            </div>
                        ) : (
                            notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`p-4 border-b hover:bg-blue-50 cursor-pointer transition-colors ${
                                        !notification.isRead ? 'bg-blue-50' : ''
                                    }`}
                                    onClick={() => markAsRead(notification.id)}
                                >
                                    <div className="flex items-start space-x-4">
                                        <div className="flex-shrink-0">
                                            <img
                                                src={notification.senderImageUrl || 'https://via.placeholder.com/40'}
                                                alt={notification.senderName}
                                                className="w-12 h-12 rounded-full border-2 border-gray-200 object-cover"
                                            />
                                            <div className="mt-2 flex justify-center">
                                                {getNotificationIcon(notification.type)}
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            {getNotificationContent(notification)}
                                            <p className="text-xs text-gray-600 mt-2 font-medium">
                                                {format(new Date(notification.createdAt), 'MMM d, yyyy h:mm a')}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;