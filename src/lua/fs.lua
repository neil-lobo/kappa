local _ = {}

---@param filename string
---@return string | nil
function _:read(filename)
    local file = io.open(filename, "r+")
    if not file then
        error("no file")
    end

    local data = file:read("a")
    file:close();
    return data
end

---@param filename string
---@param data string
function _:write(filename, data)
    local file = io.open(filename, "w")
    if not file then
        error("cannot open file")
    end

    local wrote = file:write(data) ~= nil
    file:close()
    if not wrote then
        error("failed to write to file")
    end
end

return _