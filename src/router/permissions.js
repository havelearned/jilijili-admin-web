import User from "@/views/system/user/index.vue";
import Role from "@/views/system/role/index.vue";
import Monitor from "@/views/system/monitor/index.vue";
import Menu from "@/views/system/menu/index.vue";
import Tool from "@/views/system/tool/index.vue";
import Cookie from "@/boot/cookie";

const dynamicRouting = [
    {
        path: '/system',
        meta: {
            menuName: "系统管理",
            icon: "user"
        }, children:
            [
                {
                    path: 'user',
                    meta: {
                        menuName: "用户管理",
                        icon: "user"
                    },
                    component: User,
                }, {
                path: 'role',
                meta: {
                    menuName: "角色管理",
                    icon: "role"
                },
                component: Role,
            }, {
                path: 'menu',
                meta: {
                    menuName: "菜单管理",
                    icon: "menu"
                },
                component: Menu,
            },
                {
                    path: 'tool',
                    meta: {
                        menuName: "系统工具",
                        icon: "tool"
                    },
                    component: Tool,
                },
            ]
    }, {
        path: '/monitor',
        meta: {
            menuName: "系统监控",
            icon: "user"
        },
        component:Monitor
    },
]

// export default dynamicRouting


let menuList = Cookie.getLocalValue(Cookie.MENULIST)
function convertToRoute(menu) {
    const route = {
        path: '/' + menu.path,
        name: menu.menuName,
        meta: {
            menuId: menu.menuId,
            menuName: menu.menuName,
            icon: menu.icon,
        },
    };

    if (menu.component) {
        route.component = () => import(`@/views/${menu.component}.vue`);
    }

    if (menu.children && menu.children.length > 0) {
        route.children = menu.children.map(convertToRoute);
    }

    return route;
}




export const dynamicRoutes = menuList? menuList.map(convertToRoute) :null;
