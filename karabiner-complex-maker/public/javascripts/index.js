const createToKeyInput = () => {
    const $input = $('<input>');
    $input.addClass('to-key');
    $input.addClass('key-field');
    $input.addClass('form-control');
    $input.addClass('col-sm-10');
    $input.prop('readonly', true);
    addInputEvent($input);
    return $input;
};

const createAddToKeyButton = $self => {
    const $addButton = $('<button>');
    if ($self.hasClass('add-to-key-alone')) {
        $addButton.addClass('add-to-key-alone');
    } else {
        $addButton.addClass('add-to-key');
    }
    $addButton.addClass('btn');
    $addButton.addClass('btn-primary');
    $addButton.addClass('col-sm-1');
    $addButton.text('Add');
    $addButton.on('click', function() {
        addToKey($(this));
    });
    return $addButton;
};

const createRemoveButton = () => {
    const $removeButton = $('<buton>');
    $removeButton.addClass('remove-key');
    $removeButton.addClass('btn');
    $removeButton.addClass('btn-danger');
    $removeButton.addClass('col-sm-1');
    $removeButton.text('Remove');
    $removeButton.on('click', function () {
        removeKey($(this));
    });
    return $removeButton;
};

const createClearButton = () => {
    const $clearButton = $('<button>');
    $clearButton.addClass('clear-key');
    $clearButton.addClass('btn');
    $clearButton.addClass('btn-light');
    $clearButton.addClass('col-sm-1');
    $clearButton.text('Clear');
    $clearButton.on('click', function () {
        clearKey($(this));
    });
    return $clearButton;
};

const removeKey = ($self) => {
    const $parent = $self.parent();
    const $toKeysOwner = $parent.parent();
    $parent.remove();
    const other = $toKeysOwner.find('.form-inline');
    if (other.length == 1) {
        other.find('.remove-key').remove();
        other.append(createClearButton());
    }
};

const clearKey = $self => {
    $self.parent().find('.key-field').each((i, elem) => {
        elem.value = '';
    });
};

const addToKey = ($self) => {
    const $parent = $self.parent();
    const $clearKey = $parent.find('.clear-key');
    if ($clearKey[0]) {
        $clearKey.remove();
        $parent.append(createRemoveButton());
    }
    const $row = $('<div>');
    $row.addClass('form-inline');
    $row.append(createToKeyInput());
    $row.append(createAddToKeyButton($self));
    $row.append(createRemoveButton());
    $parent.after($row);
};

const codeMap = new Map([
    ['ArrowLeft', 'left_arrow'],
    ['ArrowRight', 'right_arrow'],
    ['ArrowUp', 'up_arrow'],
    ['ArrowDown', 'down_arrow'],
    ['MetaLeft', 'left_command'],
    ['MetaRight', 'right_command'],
    ['ControlLeft', 'left_control'],
    ['AltLeft', 'left_option'],
    ['CapsLock', 'caps_lock'],
    ['ShiftLeft', 'left_shift'],
    ['ShiftRight', 'right_shift'],
]);

const toKarabinerCode = (k) => {
    const code = codeMap.get(k);
    if (code) return code;
    if (/Key[A-Z]/.test(k)) {
        return /Key([A-Z])/.exec(k)[1].toLowerCase();
    } else if (/Digit[0-9]/.test(k)) {
        return /Digit([0-9])/.exec(k)[1];
    }
    return k;
};

const keySet = new Set();

const drawKeys = ($input) => {
    let keys = '';
    keySet.forEach(k => {
        keys += k + ' ';
    });
    $input.val(keys);
};

const keyDown = (e, $input) => {
    keySet.add(toKarabinerCode(e.originalEvent.code));
    drawKeys($input);
};

const keyUp = (e) => {
    keySet.delete(toKarabinerCode(e.originalEvent.code));
};

const addInputEvent = ($input) => {
    $input.on('keydown', e => {
        keyDown(e, $input);
    });
    $input.on('keyup', e => {
        keyUp(e);
    });
    $input.on('blur', () => {
        keySet.clear();
    })
};

const toKeysOneline = ($elems) => {
    let toKeys = '';
    $elems.each((i, elem) => {
        toKeys += ' -> ' + elem.value;
    });
    return toKeys.slice(' -> '.length);
};

const doneAdd = () => {
    const $th = $('<th>');
    $th.prop('scope', 'row');
    $th.text($('#description').val());
    const $td1 = $('<td>');
    $td1.text($('#inputKey').val());
    const $td2 = $('<td>');
    $td2.text('any');
    const $td3 = $('<td>');
    $td3.text(toKeysOneline($('.to-key')));
    const $td4 = $('<td>');
    $td4.text(toKeysOneline($('.to-key-alone')));
    const $tr = $('<tr>');
    $tr.append($th);
    $tr.append($td1);
    $tr.append($td2);
    $tr.append($td3);
    $tr.append($td4);
    $('#manipulators').append($tr);
    $.colorbox.close();
};

const cancelAdd = () => {
    $.colorbox.close();
};

const getResult = () => {
    const result = {};
    result.title = $('#title').val();
    result.rules = [];
    const $tableData = $('#manipulators');
    const rows = $tableData.find(('tr'));
    rows.each((i, row) => {
        const cols = $(row).find('td');
        cols.each((i, col) => {
            console.log(col);
        });
    });
    $('#result').val(JSON.stringify(result));
};

$(() => {
    $('#addManipulator').colorbox({
        width: '90%',
        height: '90%',
        inline: true,
        overlayClose: false,
        escKey: false
    });
    $('.add-to-key').on('click', function() {
        addToKey($(this));
    });
    $('.add-to-key-alone').on('click', function () {
        addToKey($(this));
    });
    $('.remove-key').on('click', function () {
        removeKey($(this));
    });
    $('.clear-key').on('click', function () {
        clearKey($(this));
    });
    addInputEvent($('#inputKey'));
    addInputEvent($('.to-key'));
    addInputEvent($('.to-key-alone'));
    $('#doneAdd').on('click', () => {
        doneAdd();
    });
    $('#cancelAdd').on('click', () => {
        cancelAdd();
    });
    $('#getResult').on('click', () => {
        getResult();
    });
});
