/*!
 * Route List 0.0.1
 *
 * Copyright 2013, Federico Giovagnoli <mailto:gvg.fede@gmail.com>
 * Released under the MIT license
 */

define([
	'lib/x',
	'comp/list'
], function(
	x,
	List
) {

	return x.Class({
		parent: List,
		constructor: function(o) {
			List.apply(this, Array.prototype.slice.call(arguments, 0));
			this._draggedElement = null;

			this._root.addEventListener('dragstart', this._onDragStart.bind(this));
			this._root.addEventListener('dragenter', this._onDragEnter.bind(this));
			this._root.addEventListener('dragover', this._onDragOver.bind(this));

			this._boundDragEnd = this._onDragEnd.bind(this);
			this._boundDrop = this._onDrop.bind(this);
		},
		refresh: function() {
			List.prototype.refresh.apply(this, Array.prototype.slice.call(arguments, 0));
			if (this._model.items.length) {
				this.emit('list:filled');
			} else {
				this.emit('list:empty');
			}
		},
		_onListClick: function(e) {
			var el = e.srcElement || e.target;

			if (el.classList.contains('btn')) {
				this.emit('btn:remove', el.dataset);
			}
		},
		_onDragStart: function(e) {
			e.dataTransfer.effectAllowed = 'move';
			var el = e.srcElement || e.target;
			if (el.getAttribute('draggable') == 'true') {
				this._draggedElement = el;
				if (el.previousSibling) {
					e.dataTransfer.setData('prevIndex', el.previousSibling.dataset.idx);
				} else {
					e.dataTransfer.setData('prevIndex', 'first');
				}
				el.addEventListener('dragend', this._boundDragEnd);
				el.addEventListener('drop', this._boundDrop);
				setTimeout(function() {
					el.style.opacity = 0;
				}, 0);
			}
		},
		_onDragEnter: function(e) {
			e.preventDefault();
			e.dataTransfer.dropEffect = 'move';

			var el = e.srcElement || e.target;
			while (!el.classList.contains('route-box')
					&& el.getAttribute('draggable') != 'true') {
				el = el.parentNode;
			}
			if (el.getAttribute('draggable') == 'true') {
				if (el == this._draggedElement.nextSibling) {
					if (el == this._root.lastChild) {
						this.nodes.add(this._draggedElement);
					} else {
						this._root.insertBefore(this._draggedElement, el.nextSibling);
					}
				} else {
					this._root.insertBefore(this._draggedElement, el);
				}
			}
			return false;
		},
		_onDragOver: function(e) {
			e.preventDefault();
			e.dataTransfer.dropEffect = 'move';
			return false;
		},
		_onDrop: function(e) {
			e.stopPropagation();
			this._rearrangeList(e.dataTransfer.getData('prevIndex'));
			return false;
		},
		_onDragEnd: function(e) {
			e.dataTransfer.dropEffect = 'move';

			var el = e.srcElement || e.target;
			el.removeEventListener('dragend', this._boundDragEnd);
			el.removeEventListener('dragend', this._boundDrop);
			el.style.opacity = '';
		},
		_rearrangeList: function(prevIndex) {
			var
				dropIndex = 0,
				dragIndex = this._draggedElement.dataset.idx;
			if (this._draggedElement.previousSibling) {
				dropIndex = this._draggedElement.previousSibling.dataset.idx;
			} else {
				dropIndex = 'first';
			}
			if (prevIndex != dropIndex) {
				var draggedData = this._model.items.splice(dragIndex, 1)[0];
				if (dropIndex == 'first') {
					this._model.items.unshift(draggedData);
				} else {
					if (dropIndex < dragIndex) {
						dropIndex++;
					}
					this._model.items.splice(dropIndex, 0, draggedData);
				}
				var domEl = this.nodes.every('.route-item');
				for (var i = 0, el; el = domEl[i]; i++) {
					el.dataset.idx = i;
				}
				this.emit('list:changed');
			}
		}
	});
});
