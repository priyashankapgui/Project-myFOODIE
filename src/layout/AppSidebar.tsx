/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSidebar } from "../context/SidebarContext";
import { getLocalUser } from "@/store/local_storage";
import {
  FiGrid,
  FiChevronDown,
  FiBox,
  FiMoreHorizontal,
  FiCoffee,
  FiShoppingBag,
  FiUsers,
  FiLayers,
  FiBriefcase,
} from "react-icons/fi";

// Define user roles
type UserRole = | "management" | "supplier" | "normalEmployee";





type SubItem = {
  name: string;
  path: string;
  pro?: boolean;
  new?: boolean;
  allowedRoles?: UserRole[];
};

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: SubItem[];
  allowedRoles?: UserRole[];
};

const navItems: NavItem[] = [
  {
    icon: <FiGrid size={20} />,
    name: "Dashboard",
    path: "/dashboard",
    allowedRoles: ["management", "supplier", "normalEmployee"],
  },
  {
    icon: <FiCoffee size={20} />,
    name: "Today Special",
    path: "/today-special",
    allowedRoles: ["management", "supplier", "normalEmployee"],
  },
  {
    icon: <FiBox size={20} />,
    name: "Food Items",
    path: "/food-items",
    allowedRoles: ["management", "supplier", "normalEmployee"],
  },
  {
    icon: <FiShoppingBag size={20} />,
    name: "My Orders",
    path: "/orders",
    allowedRoles: ["management", "supplier", "normalEmployee"],
  },
  {
    icon: <FiUsers size={20} />,
    name: "Users",
    allowedRoles: ["management"],
    subItems: [
      { name: "Employees", path: "/users/employees" },
      { name: "Suppliers", path: "/users/suppliers" },
      { name: "Managers", path: "/users/managers" },
    ],
  },
  {
    icon: <FiLayers size={20} />,
    name: "Complaints",
    allowedRoles: ["management", "normalEmployee", "supplier"],
    subItems: [
      {
        name: "Complaint Form",
        path: "/complaints",
        allowedRoles: ["management", "normalEmployee"]
      },
      {
        name: "Complaint View",
        path: "/complaints/view",
        allowedRoles: ["management", "supplier"]
      },
    ],
  },
  {
    icon: <FiBriefcase size={20} />,
    name: "Departments",
    path: "/departments",
    allowedRoles: ["management"],
  },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();
  const [userRole, setUserRole] = useState<UserRole | "">("");
  const [filteredNavItems, setFilteredNavItems] = useState<NavItem[]>([]);

  // Get user role on component mount
  useEffect(() => {
    const user = getLocalUser();
    setUserRole(user.role);

    // Filter navigation items based on user role
    const filteredItems = navItems.filter(item => {
      // If no allowedRoles specified, show to everyone
      if (!item.allowedRoles) return true;

      // Check if user's role is in the allowedRoles array
      return item.allowedRoles.includes(user.role);
    }).map(item => {
      // If item has subItems, filter them too
      if (item.subItems) {
        return {
          ...item,
          subItems: item.subItems.filter(subItem => {
            // If no allowedRoles specified, show to everyone
            if (!subItem.allowedRoles) return true;

            // Check if user's role is in the allowedRoles array
            return subItem.allowedRoles.includes(user.role);
          })
        };
      }
      return item;
    });

    setFilteredNavItems(filteredItems);
  }, []);

  const renderMenuItems = (
    navItems: NavItem[],
    menuType: "main"
  ) => (
    <ul className="flex flex-col gap-4">
      {navItems.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems && nav.subItems.length > 0 ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`menu-item group  ${openSubmenu?.type === menuType && openSubmenu?.index === index
                ? "menu-item-active"
                : "menu-item-inactive"
                } cursor-pointer ${!isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "lg:justify-start"
                }`}
            >
              <span
                className={` ${openSubmenu?.type === menuType && openSubmenu?.index === index
                  ? "menu-item-icon-active"
                  : "menu-item-icon-inactive"
                  } `}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className={`menu-item-text`}>{nav.name}</span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <FiChevronDown
                  className={`ml-auto w-5 h-5 transition-transform duration-200  ${openSubmenu?.type === menuType &&
                    openSubmenu?.index === index
                    ? "rotate-180 text-brand-500"
                    : ""
                    }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                href={nav.path}
                className={`menu-item group ${isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                  }`}
              >
                <span
                  className={`${isActive(nav.path)
                    ? "menu-item-icon-active"
                    : "menu-item-icon-inactive"
                    }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className={`menu-item-text`}>{nav.name}</span>
                )}
              </Link>
            )
          )}
          {nav.subItems && nav.subItems.length > 0 && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : "0px",
              }}
            >
              <ul className="mt-2 space-y-1 ml-9">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      href={subItem.path}
                      className={`menu-dropdown-item ${isActive(subItem.path)
                        ? "menu-dropdown-item-active"
                        : "menu-dropdown-item-inactive"
                        }`}
                    >
                      {subItem.name}
                      <span className="flex items-center gap-1 ml-auto">
                        {subItem.new && (
                          <span
                            className={`ml-auto ${isActive(subItem.path)
                              ? "menu-dropdown-badge-active"
                              : "menu-dropdown-badge-inactive"
                              } menu-dropdown-badge `}
                          >
                            new
                          </span>
                        )}
                        {subItem.pro && (
                          <span
                            className={`ml-auto ${isActive(subItem.path)
                              ? "menu-dropdown-badge-active"
                              : "menu-dropdown-badge-inactive"
                              } menu-dropdown-badge `}
                          >
                            pro
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {}
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback((path: string) => path === pathname, [pathname]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: "main") => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${isExpanded || isMobileOpen
          ? "w-[290px]"
          : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-8 flex  ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
          }`}
      >
        <Link href="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <h1 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/80 ">MyFOODIE</h1>
            </>
          ) : (
            <Image
              src="/images/logo/logo.svg"
              alt="Logo"
              width={32}
              height={32}
            />
          )}
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-7">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "justify-start"
                  }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Menu"
                ) : (
                  <FiMoreHorizontal />
                )}
              </h2>
              {renderMenuItems(filteredNavItems, "main")}
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;