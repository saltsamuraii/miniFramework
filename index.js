const vDomExample = {
  tag: 'div',
  props: {
    class: 'container',
  },
  children: [
    {
      tag: 'h1',
      props: {
        title: 'this is title',
      },
      children: 'Basics of JS Framework',
    },
    {
      tag: 'p',
      props: {
        class: 'description',
      },
      children: 'Here we learn, what is behind of every modern JS Framework',
    },
  ]
}

// Create virtual node (but don't mount it)
function h(tag, props, children) {
  return {
    tag,
    props,
    children
  }
}

// Mount a virtual node to the DOM
function mount(vnode, container) {
  const element = document.createElement(vnode.tag)

  for (const key in vnode.props) {
    element.setAttribute(key, vnode.props[key])
  }

  if (typeof vnode.children === 'string') {
    element.textContent = vnode.children
  } else {
    vnode.children.forEach((child) => {
      mount(child, element)
    });
  }

  container.appendChild(element)
  vnode.$element = element
}

// Unmount vnode from the DOM
function unmount(vnode) {
  vnode.$element.parentNode.removeChild(vnode.$element)
}

// Takes 2 nodes, compares them and figures out the difference
function patch(node1, node2) {

  // different tags
  if (node1.tag !== node2.tag) {
    mount(node2, node1.$element.parentNode)
    unmount(node1)
  } else {
    node2.$element = node1.$element

    if (typeof node2.children === 'string') {
      node2.$element.textContent = node2.children
    } else {
      while (node2.$element.attributes.length > 0) {
        node2.$element.removeAttribute(node2.$element.attributes[0].name)
      }
      for (const key in node2.props) {
        node2.$element.setAttribute(key, node2.props[key])
      }

      if (typeof node1.children === 'string') {
        node2.$element.textContent = null
        node2.children.forEach((child) => {
          mount(child, node2.$element)
        })
      } else {
        const commonLength = Math.min(node1.children.length, node2.children.length)

        for (let i = 0; i < commonLength; i++) {
          patch(node1.children[i], node2.children[i])
        }

        if (node1.children.length > node2.children.length) {
          node1.children.slice(node2.children.length).forEach((child) => {
            unmount(child)
          })
        } else if (node2.children.length > node1.children.length) {
          node2.children.slice(node1.children.length).forEach((child) => {
            mount(child)
          })
        }
      }
    }
  }
}
